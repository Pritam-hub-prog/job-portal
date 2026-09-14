const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        message: 'Authentication required'
      })
    }

    // Check if user's role is allowed
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message:
          'You are not authorized to perform this action'
      })
    }

    // User has the required role
    next()
  }
}

module.exports = roleMiddleware