import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

function Login() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

    try {
      setLoading(true)

      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        {
          email: formData.email,
          password: formData.password
        }
      )

      console.log(
        'Login response:',
        response.data
      )

      /* =========================================
         SAVE LOGIN INFORMATION
         ========================================= */

      localStorage.setItem(
        'token',
        response.data.token
      )

      localStorage.setItem(
        'user',
        JSON.stringify(response.data.user)
      )


      /* =========================================
         ROLE BASED LOGIN MESSAGE
         ========================================= */

      if (
        response.data.user.role === 'recruiter'
      ) {
        alert('Login successful recruiter')

        navigate('/recruiter-home')
      } else {
        alert('Login successful')

        navigate('/')
      }

    } catch (error) {

      console.log(
        'Login error:',
        error
      )

      if (error.response) {

        alert(
          error.response.data.message ||
            'Invalid email or password'
        )

      } else {

        alert(
          'Unable to connect to server. Please make sure the backend is running.'
        )

      }

    } finally {

      setLoading(false)

    }
  }


  return (
    <div>

      {/* =========================================
          NAVBAR
          ========================================= */}

      <nav className="navbar">

        <h2 className="logo">
          JobPortal
        </h2>

        <div className="nav-links">

          <Link to="/">
            Home
          </Link>

          <Link to="/jobs">
            Jobs
          </Link>

          <Link to="/companies">
            Companies
          </Link>

          <Link to="/about">
            About
          </Link>

          <Link to="/signup">
            Signup
          </Link>

        </div>

      </nav>


      {/* =========================================
          LOGIN PAGE
          ========================================= */}

      <main className="auth-page">

        <div className="auth-card">

          <h1>
            Login
          </h1>

          <p className="auth-description">
            Login to your JobPortal account.
          </p>


          <form onSubmit={handleSubmit}>

            {/* Email */}

            <div className="form-group">

              <label htmlFor="email">
                Email Address *
              </label>

              <input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                required
              />

            </div>


            {/* Password */}

            <div className="form-group">

              <label htmlFor="password">
                Password *
              </label>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />

            </div>


            {/* Forgot Password */}

            <div className="forgot-password">

              <Link to="/forgot-password">
                Forgot Password?
              </Link>

            </div>


            {/* Login Button */}

            <button
              type="submit"
              className="apply-button"
              disabled={loading}
            >
              {loading
                ? 'Logging in...'
                : 'Login'}
            </button>

          </form>


          {/* Signup */}

          <div className="auth-footer">

            <p>

              Don't have an account?{' '}

              <Link to="/signup">
                Create Account
              </Link>

            </p>

          </div>

        </div>

      </main>

    </div>
  )
}

export default Login