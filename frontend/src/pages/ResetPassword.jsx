import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }

    // Check password length
    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters')
      return
    }

    try {
      setLoading(true)

      const response = await axios.post(
        `http://https://job-portal-p5o9.onrender.com/api/auth/reset-password/${token}`,
        {
          password: formData.password
        }
      )

      alert(response.data.message)

      // Go back to login after successful reset
      navigate('/login')
    } catch (error) {
      if (error.response) {
        alert(
          error.response.data.message ||
            'Password reset failed'
        )
      } else {
        alert('Cannot connect to server')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <h2 className="logo">JobPortal</h2>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/jobs">Jobs</Link>
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
        </div>
      </nav>

      {/* Reset Password */}
      <main className="auth-page">
        <div className="auth-card">
          <h1>Reset Password</h1>

          <p className="auth-description">
            Create a new password for your JobPortal
            account.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="password">
                New Password *
              </label>

              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter new password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                Confirm New Password *
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="apply-button"
              disabled={loading}
            >
              {loading
                ? 'Resetting Password...'
                : 'Reset Password'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Remember your password?{' '}
              <Link to="/login">
                Back to Login
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ResetPassword