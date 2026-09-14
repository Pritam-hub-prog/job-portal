const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
  try {
    // Get authorization header
    const authHeader = req.headers.authorization

    // Check if token exists
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Authentication required'
      })
    }

    // Extract token
    const token = authHeader.split(' ')[1]

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    )

    // Store user information in request
    req.user = decoded

    // Continue to the next middleware/route
    next()
  } catch (error) {
    console.log('Authentication error:', error.message)

    return res.status(401).json({
      message: 'Invalid or expired token'
    })
  }
}

module.exports = authMiddleware