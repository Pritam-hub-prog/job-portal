const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ['job-seeker', 'recruiter'],
      default: 'job-seeker'
    },

    // =========================
    // Profile Information
    // =========================

    phone: {
      type: String,
      default: '',
      trim: true
    },

    location: {
      type: String,
      default: '',
      trim: true
    },

    qualification: {
      type: String,
      default: '',
      trim: true
    },

    skills: {
      type: String,
      default: '',
      trim: true
    },

    experience: {
      type: String,
      default: '',
      trim: true
    },

    linkedin: {
      type: String,
      default: '',
      trim: true
    },

    github: {
      type: String,
      default: '',
      trim: true
    },

    portfolio: {
      type: String,
      default: '',
      trim: true
    },

    company: {
      type: String,
      default: '',
      trim: true
    },

    // =========================
    // Password Reset
    // =========================

    resetPasswordToken: {
      type: String,
      default: null
    },

    resetPasswordExpires: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
)

const User = mongoose.model('User', userSchema)

module.exports = User