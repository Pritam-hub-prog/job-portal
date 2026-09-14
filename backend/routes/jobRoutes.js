const express = require('express')
const Job = require('../models/Job')

const protect = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')

const router = express.Router()

// ========================================
// POST A NEW JOB
// Only logged-in recruiters can post jobs
// ========================================

router.post(
  '/',
  protect,
  roleMiddleware('recruiter'),
  async (req, res) => {
    try {
      const {
        title,
        company,
        location,
        type,
        salary,
        description,
        skills
      } = req.body

      // Check required fields
      if (
        !title ||
        !company ||
        !location ||
        !type ||
        !salary ||
        !description ||
        !skills
      ) {
        return res.status(400).json({
          message: 'Please fill all required fields'
        })
      }

      // Create job
      const job = await Job.create({
        title,
        company,
        location,
        type,
        salary,
        description,
        skills,
        recruiter: req.user.id
      })

      res.status(201).json({
        message: 'Job posted successfully',
        job
      })
    } catch (error) {
      console.log('Post job error:', error)

      res.status(500).json({
        message: 'Failed to post job',
        error: error.message
      })
    }
  }
)

// ========================================
// GET ALL JOBS
// Public route
// ========================================

router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate('recruiter', 'name email')
      .sort({ createdAt: -1 })

    res.json({
      jobs
    })
  } catch (error) {
    console.log('Get jobs error:', error)

    res.status(500).json({
      message: 'Failed to fetch jobs'
    })
  }
})

// ========================================
// GET MY POSTED JOBS
// Only logged-in recruiters
// ========================================

router.get(
  '/my-jobs',
  protect,
  roleMiddleware('recruiter'),
  async (req, res) => {
    try {
      const jobs = await Job.find({
        recruiter: req.user.id
      }).sort({ createdAt: -1 })

      res.json({
        jobs
      })
    } catch (error) {
      console.log('Get my jobs error:', error)

      res.status(500).json({
        message: 'Failed to fetch your jobs'
      })
    }
  }
)

// ========================================
// GET ALL COMPANIES
// Public route
// ========================================

router.get('/companies', async (req, res) => {
  try {
    const jobs = await Job.find()
      .select('company location')

    const companiesMap = {}

    jobs.forEach((job) => {
      if (!companiesMap[job.company]) {
        companiesMap[job.company] = {
          name: job.company,
          location: job.location,
          jobs: 0
        }
      }

      companiesMap[job.company].jobs += 1
    })

    const companies = Object.values(companiesMap)

    res.json(companies)
  } catch (error) {
    console.log('Get companies error:', error)

    res.status(500).json({
      message: 'Failed to fetch companies'
    })
  }
})

// ========================================
// GET SINGLE JOB
// Public route
// ========================================

router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('recruiter', 'name email')

    if (!job) {
      return res.status(404).json({
        message: 'Job not found'
      })
    }

    res.json({
      job
    })
  } catch (error) {
    console.log('Get single job error:', error)

    res.status(500).json({
      message: 'Failed to fetch job'
    })
  }
})

// ========================================
// UPDATE MY JOB
// Only the recruiter who created it
// ========================================

router.put(
  '/:id',
  protect,
  roleMiddleware('recruiter'),
  async (req, res) => {
    try {
      // Find the job
      const job = await Job.findById(req.params.id)

      if (!job) {
        return res.status(404).json({
          message: 'Job not found'
        })
      }

      // Make sure this recruiter owns the job
      if (
        job.recruiter.toString() !==
        req.user.id.toString()
      ) {
        return res.status(403).json({
          message: 'You can only update your own jobs'
        })
      }

      const {
        title,
        company,
        location,
        type,
        salary,
        description,
        skills
      } = req.body

      // Check required fields
      if (
        !title ||
        !company ||
        !location ||
        !type ||
        !salary ||
        !description ||
        !skills
      ) {
        return res.status(400).json({
          message: 'Please fill all required fields'
        })
      }

      // Update job
      job.title = title
      job.company = company
      job.location = location
      job.type = type
      job.salary = salary
      job.description = description
      job.skills = skills

      await job.save()

      res.json({
        message: 'Job updated successfully',
        job
      })
    } catch (error) {
      console.log('Update job error:', error)

      res.status(500).json({
        message: 'Failed to update job',
        error: error.message
      })
    }
  }
)

// ========================================
// DELETE MY JOB
// Only the recruiter who created it
// ========================================

router.delete(
  '/:id',
  protect,
  roleMiddleware('recruiter'),
  async (req, res) => {
    try {
      const job = await Job.findById(req.params.id)

      if (!job) {
        return res.status(404).json({
          message: 'Job not found'
        })
      }

      // Make sure this recruiter owns the job
      if (
        job.recruiter.toString() !==
        req.user.id.toString()
      ) {
        return res.status(403).json({
          message: 'You can only delete your own jobs'
        })
      }

      await Job.findByIdAndDelete(req.params.id)

      res.json({
        message: 'Job deleted successfully'
      })
    } catch (error) {
      console.log('Delete job error:', error)

      res.status(500).json({
        message: 'Failed to delete job'
      })
    }
  }
)

// ========================================
// EXPORT ROUTER
// ========================================

module.exports = router