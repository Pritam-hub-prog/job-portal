const dns = require('dns')

dns.setServers(['8.8.8.8', '1.1.1.1'])

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const path = require('path')
require('dotenv').config()

const authRoutes = require('./routes/authRoutes')
const applicationRoutes = require('./routes/applicationRoutes')
const jobRoutes = require('./routes/jobRoutes')
const profileRoutes = require('./routes/profileRoutes')

const app = express()

// ========================================
// MIDDLEWARE
// ========================================

app.use(cors())
app.use(express.json())

// ========================================
// UPLOADS
// ========================================

// Make uploaded resumes and PDF files
// accessible through the browser
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'))
)

// ========================================
// ROUTES
// ========================================

app.use('/api/auth', authRoutes)
app.use('/api/applications', applicationRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/profile', profileRoutes)

// ========================================
// TEST ROUTE
// ========================================

app.get('/', (req, res) => {
  res.send('JobPortal Backend Server is running!')
})

// ========================================
// MONGODB CONNECTION
// ========================================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully')
  })
  .catch((error) => {
    console.log('MongoDB connection failed')
    console.log(error.message)
  })

// ========================================
// START SERVER
// ========================================

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  )
})