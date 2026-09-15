import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetUrl, setResetUrl] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      setResetUrl('')

      const response = await axios.post(
        'https://job-portal-p5o9.onrender.com/api/auth/forgot-password',
        { email }
      )

      alert(response.data.message)

      // Development only
      // Backend provides the reset URL instead of sending an email
      if (response.data.resetUrl) {
        setResetUrl(response.data.resetUrl)
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message)
      } else {
        alert('Cannot connect to server')
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
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
        </div>
      </nav>

      <main className="auth-page">
        <div className="auth-card">
          <h1>Forgot Password</h1>

          <p className="auth-description">
            Enter your email address and we will send you a
            password reset link.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>

              <input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="apply-button"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          {/* Development reset link */}
          {resetUrl && (
            <div className="reset-link-box">
              <p>
                <strong>Development Reset Link:</strong>
              </p>

              <a
                href={resetUrl}
                className="view-job-button"
              >
                Open Reset Password
              </a>
            </div>
          )}

          <div className="auth-footer">
            <p>
              Remember your password?{' '}
              <Link to="/login">Back to Login</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ForgotPassword