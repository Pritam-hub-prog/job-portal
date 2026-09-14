const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const Application = require('../models/Application')
const Job = require('../models/Job')

const protect = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')

const router = express.Router()

// ==============================
// Multer Configuration
// ==============================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },

  filename: (req, file, cb) => {
    const extension = path
      .extname(file.originalname)
      .toLowerCase()

    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${extension}`

    cb(null, uniqueName)
  }
})

// Only allow PDF files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true)
  } else {
    cb(new Error('Only PDF resume files are allowed'))
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
})

// ==============================
// Submit Job Application
// ==============================

router.post(
  '/',
  protect,

  (req, res, next) => {
    upload.single('resume')(req, res, (error) => {
      if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            message: 'Resume file must be less than 5 MB'
          })
        }

        return res.status(400).json({
          message: error.message
        })
      }

      if (error) {
        return res.status(400).json({
          message: error.message
        })
      }

      next()
    })
  },

  async (req, res) => {
    try {
      // Find the job using MongoDB _id
      const job = await Job.findById(req.body.jobId)

      if (!job) {
        // Delete uploaded file if job does not exist
        if (req.file) {
          fs.unlinkSync(req.file.path)
        }

        return res.status(404).json({
          message: 'Job not found'
        })
      }

      // ==========================================
      // Check Duplicate Application
      // ==========================================

      const existingApplication =
        await Application.findOne({
          user: req.user.id,
          jobId: job._id
        })

      if (existingApplication) {
        // Delete newly uploaded file because application
        // already exists
        if (req.file) {
          fs.unlinkSync(req.file.path)
        }

        return res.status(400).json({
          message:
            'You have already applied for this job'
        })
      }

      // Get the recruiter from the job
      const recruiterId = job.recruiter

      // ==========================================
      // Resume Path
      // ==========================================

      let resumePath = ''

      if (req.file) {
        resumePath = `/uploads/${req.file.filename}`
      }

      // ==========================================
      // Create Application
      // ==========================================

      const application = await Application.create({
        ...req.body,

        // Job seeker who is applying
        user: req.user.id,

        // Recruiter who owns this job
        recruiter: recruiterId,

        // Make sure the correct job ID is stored
        jobId: job._id,

        // Save uploaded resume path
        resume: resumePath
      })

      res.status(201).json({
        message: 'Application submitted successfully',
        application
      })
    } catch (error) {
      console.log(error)

      // Delete uploaded file if database operation fails
      if (req.file) {
        try {
          fs.unlinkSync(req.file.path)
        } catch (deleteError) {
          console.log(
            'Failed to delete uploaded file'
          )
        }
      }

      res.status(500).json({
        message: 'Failed to submit application',
        error: error.message
      })
    }
  }
)

// ==============================
// Get My Applications
// ==============================

router.get(
  '/my-applications',
  protect,
  async (req, res) => {
    try {
      const applications = await Application.find({
        user: req.user.id
      })
        .populate('jobId')
        .sort({ createdAt: -1 })

      res.json({
        applications
      })
    } catch (error) {
      console.log(error)

      res.status(500).json({
        message: 'Failed to fetch applications'
      })
    }
  }
)

// ==============================
// Get Applications For Recruiter
// ==============================

router.get(
  '/recruiter-applications',
  protect,
  roleMiddleware('recruiter'),
  async (req, res) => {
    try {
      // ==========================================
      // Step 1: Find ALL jobs posted by recruiter
      // ==========================================

      const recruiterJobs = await Job.find({
        recruiter: req.user.id
      }).select('_id')

      // Get only the job IDs
      const jobIds = recruiterJobs.map(
        (job) => job._id
      )

      console.log(
        'Recruiter ID:',
        req.user.id.toString()
      )

      console.log(
        'Recruiter Job IDs:',
        jobIds.map((id) => id.toString())
      )

      // ==========================================
      // Step 2: Find applications
      // ==========================================

      const applications = await Application.find({
        $or: [
          {
            recruiter: req.user.id
          },
          {
            jobId: {
              $in: jobIds
            }
          }
        ]
      })
        .populate('user', 'name email')
        .populate('jobId')
        .sort({ createdAt: -1 })

      console.log(
        'Applications found:',
        applications.length
      )

      res.json({
        applications
      })
    } catch (error) {
      console.log(error)

      res.status(500).json({
        message:
          'Failed to fetch recruiter applications',
        error: error.message
      })
    }
  }
)

// ==============================
// Update Application Status
// ==============================

router.put(
  '/status/:id',
  protect,
  roleMiddleware('recruiter'),
  async (req, res) => {
    try {
      const { status } = req.body

      // Allowed application statuses
      const allowedStatuses = [
        'Applied',
        'Reviewing',
        'Shortlisted',
        'Rejected'
      ]

      // Check if status is valid
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: 'Invalid application status'
        })
      }

      // Find application
      const application =
        await Application.findById(req.params.id)

      if (!application) {
        return res.status(404).json({
          message: 'Application not found'
        })
      }

      // ==========================================
      // Check that the application belongs to a job
      // owned by the logged-in recruiter
      // ==========================================

      const job = await Job.findOne({
        _id: application.jobId,
        recruiter: req.user.id
      })

      if (!job) {
        return res.status(403).json({
          message:
            'Not authorized to update this application'
        })
      }

      // Update status
      application.status = status

      await application.save()

      res.json({
        message:
          'Application status updated successfully',
        application
      })
    } catch (error) {
      console.log(error)

      res.status(500).json({
        message:
          'Failed to update application status',
        error: error.message
      })
    }
  }
)

// ==============================
// Export Router
// ==============================

module.exports = router