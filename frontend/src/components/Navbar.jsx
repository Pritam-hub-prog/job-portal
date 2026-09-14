import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('user')

        if (storedUser) {
          setUser(JSON.parse(storedUser))
        } else {
          setUser(null)
        }
      } catch (error) {
        console.log('Navbar user error:', error)
        setUser(null)
      }
    }

    loadUser()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    setUser(null)

    navigate('/login')
  }

  return (
    <nav className="navbar">
      <h2 className="logo">JobPortal</h2>

      <div className="nav-links">

        {/* HOME */}
        <Link
          to={
            user?.role === 'recruiter'
              ? '/recruiter-home'
              : '/'
          }
        >
          Home
        </Link>

        {/* JOBS */}
        <Link to="/jobs">
          Jobs
        </Link>

        {/* JOB SEEKER NAVIGATION */}
        {user?.role === 'job-seeker' && (
          <Link to="/my-applications">
            My Applications
          </Link>
        )}

        {/* RECRUITER NAVIGATION */}
        {user?.role === 'recruiter' && (
          <>
            <Link to="/recruiter-dashboard">
              Dashboard
            </Link>

            <Link to="/recruiter-applications">
              Applications
            </Link>
          </>
        )}

        {/* PROFILE */}
        {user && (
          <Link to="/profile">
            Profile
          </Link>
        )}

        {/* COMMON */}
        <Link to="/companies">
          Companies
        </Link>

        <Link to="/about">
          About
        </Link>

        {/* AUTH */}
        {user ? (
          <button
            className="nav-logout"
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <>
            <Link to="/login">
              Login
            </Link>

            <Link to="/signup">
              Signup
            </Link>
          </>
        )}

      </div>
    </nav>
  )
}

export default Navbar