import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

function Signup() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Check passwords
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!')
      return
    }

    try {
      setLoading(true)

      const response = await axios.post(
        'http://https://job-portal-p5o9.onrender.com/api/auth/signup',
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        }
      )

      alert(response.data.message)

      // Go to login page after successful signup
      navigate('/login')

    } catch (error) {
      if (error.response) {
        alert(error.response.data.message)
      } else {
        alert('Unable to connect to the server.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <nav className="navbar">
        <h2 className="logo">JobPortal</h2>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/jobs">Jobs</Link>
          <Link to="#">Companies</Link>
          <Link to="#">About</Link>
          <Link to="/login">Login</Link>
        </div>
      </nav>

      <main className="auth-page">
        <div className="auth-card">

          <h1>Create Account</h1>

          <p className="auth-description">
            Create your JobPortal account to find and apply for jobs.
          </p>

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label htmlFor="name">Full Name *</label>

              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>

              <input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password *</label>

              <input
                id="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                Confirm Password *
              </label>

              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">Account Type *</label>

              <select
                id="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="">Select Account Type</option>
                <option value="job-seeker">Job Seeker</option>
                <option value="recruiter">Recruiter</option>
              </select>
            </div>

            <button
              type="submit"
              className="apply-button"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login">Login</Link>
            </p>
          </div>

        </div>
      </main>
    </div>
  )
}

export default Signup