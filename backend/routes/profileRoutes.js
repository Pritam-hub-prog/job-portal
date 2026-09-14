const express = require('express')
const User = require('../models/User')
const protect = require('../middleware/authMiddleware')

const router = express.Router()

// =========================
// GET USER PROFILE
// =========================

router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      '-password -resetPasswordToken -resetPasswordExpires'
    )

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    res.status(200).json({
      user
    })
  } catch (error) {
    console.log('Get profile error:', error)

    res.status(500).json({
      message: 'Server error while fetching profile'
    })
  }
})

// =========================
// UPDATE USER PROFILE
// =========================

router.put('/', protect, async (req, res) => {
  try {
    const {
      name,
      phone,
      location,
      qualification,
      skills,
      experience,
      linkedin,
      github,
      portfolio,
      company
    } = req.body

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: 'Name is required'
      })
    }

    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    user.name = name.trim()
    user.phone = phone?.trim() || ''
    user.location = location?.trim() || ''
    user.qualification = qualification?.trim() || ''
    user.skills = skills?.trim() || ''
    user.experience = experience?.trim() || ''
    user.linkedin = linkedin?.trim() || ''
    user.github = github?.trim() || ''
    user.portfolio = portfolio?.trim() || ''
    user.company = company?.trim() || ''

    await user.save()

    const updatedUser = await User.findById(
      user._id
    ).select(
      '-password -resetPasswordToken -resetPasswordExpires'
    )

    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser
    })
  } catch (error) {
    console.log('Update profile error:', error)

    res.status(500).json({
      message: 'Server error while updating profile'
    })
  }
})

module.exports = router