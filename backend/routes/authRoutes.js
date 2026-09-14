const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const User = require('../models/User')

const router = express.Router()

// ==============================
// Test Auth Routes
// ==============================

router.get('/test', (req, res) => {
  res.json({
    message: 'Auth routes are working!'
  })
})

// ==============================
// Signup
// ==============================

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists'
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    })

    // Send response
    res.status(201).json({
      message: 'Account created successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Server error',
      error: error.message
    })
  }
})

// ==============================
// Login
// ==============================

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({
        message: 'Invalid email or password'
      })
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    )

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: 'Invalid email or password'
      })
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d'
      }
    )

    // Send response
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Server error',
      error: error.message
    })
  }
})

// ==============================
// Forgot Password
// ==============================

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body

    // Find user
    const user = await User.findOne({ email })

    // Don't reveal whether the email exists
    if (!user) {
      return res.json({
        message:
          'If an account exists with this email, a password reset link will be sent.'
      })
    }

    // Generate secure random token
    const resetToken = crypto.randomBytes(32).toString('hex')

    // Hash token before saving to database
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex')

    // Save hashed token
    user.resetPasswordToken = hashedToken

    // Token expires after 15 minutes
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000

    await user.save()

    // Development only
    // In production, this URL should be sent through email.
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`

    console.log('Password reset URL:', resetUrl)

    res.json({
      message:
        'If an account exists with this email, a password reset link will be sent.',

      // Development only
      resetUrl
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Server error'
    })
  }
})

// ==============================
// Reset Password
// ==============================

router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params
    const { password } = req.body

    // Check password
    if (!password) {
      return res.status(400).json({
        message: 'Please enter a new password'
      })
    }

    // Password length validation
    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters'
      })
    }

    // Hash the token received from URL
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex')

    // Find user with valid and non-expired token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: {
        $gt: Date.now()
      }
    })

    // Token invalid or expired
    if (!user) {
      return res.status(400).json({
        message:
          'Password reset link is invalid or has expired'
      })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Update password
    user.password = hashedPassword

    // Clear reset token
    user.resetPasswordToken = null
    user.resetPasswordExpires = null

    // Save changes
    await user.save()

    res.json({
      message:
        'Password reset successfully. You can now login.'
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: 'Server error'
    })
  }
})

// ==============================
// Export Router
// ==============================

module.exports = router