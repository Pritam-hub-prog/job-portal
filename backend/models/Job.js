const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    company: {
      type: String,
      required: true,
      trim: true
    },

    location: {
      type: String,
      required: true,
      trim: true
    },

    type: {
      type: String,
      enum: [
        'Full Time',
        'Part Time',
        'Internship'
      ],
      required: true
    },

    salary: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    skills: {
      type: String,
      required: true,
      trim: true
    },

    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
)

const Job = mongoose.model(
  'Job',
  jobSchema
)

module.exports = Job