const mongoose = require('mongoose')

const applicationSchema = new mongoose.Schema(
  {
    // User who applied for the job
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    // Recruiter who posted the job
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    // Job information
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true
    },

    jobTitle: {
      type: String,
      required: true
    },

    company: {
      type: String,
      required: true
    },

    // Personal Information
    fullName: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },

    phone: {
      type: String,
      required: true,
      trim: true
    },

    currentLocation: {
      type: String,
      required: true,
      trim: true
    },

    dateOfBirth: {
      type: String,
      default: ''
    },

    gender: {
      type: String,
      default: ''
    },

    // Education
    highestQualification: {
      type: String,
      required: true
    },

    college: {
      type: String,
      required: true
    },

    graduationYear: {
      type: String,
      required: true
    },

    // Professional Information
    experience: {
      type: String,
      required: true
    },

    currentJob: {
      type: String,
      default: ''
    },

    expectedSalary: {
      type: String,
      default: ''
    },

    noticePeriod: {
      type: String,
      default: ''
    },

    skills: {
      type: String,
      required: true
    },

    // Online Profiles
    linkedin: {
      type: String,
      default: ''
    },

    github: {
      type: String,
      default: ''
    },

    portfolio: {
      type: String,
      default: ''
    },

    // Application Information
    resume: {
      type: String,
      default: ''
    },

    coverLetter: {
      type: String,
      default: ''
    },

    whyHireYou: {
      type: String,
      default: ''
    },

    // Application Status
    status: {
      type: String,
      enum: [
        'Applied',
        'Reviewing',
        'Shortlisted',
        'Rejected'
      ],
      default: 'Applied'
    }
  },
  {
    timestamps: true
  }
)

const Application = mongoose.model(
  'Application',
  applicationSchema
)

module.exports = Application