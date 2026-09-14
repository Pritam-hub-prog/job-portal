import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate
} from 'react-router-dom'

import { useEffect, useState } from 'react'
import axios from 'axios'

import Jobs from './pages/Jobs'
import JobDetails from './pages/JobDetails'
import ApplyJob from './pages/ApplyJob'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import MyApplications from './pages/MyApplications'
import RecruiterDashboard from './pages/RecruiterDashboard'
import RecruiterHome from './pages/RecruiterHome'
import RecruiterApplications from './pages/RecruiterApplications'
import Companies from './pages/Companies'
import About from './pages/About'
import Profile from './pages/Profile'

import Navbar from './components/Navbar'

import './App.css'

// ========================================
// HOME PAGE
// ========================================

function Home() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [jobs, setJobs] = useState([])
  const [jobsLoading, setJobsLoading] = useState(true)

  // ========================================
  // GET LOGGED-IN USER
  // ========================================

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user')

      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.log('Error reading user:', error)
      setUser(null)
    }
  }, [])

  // ========================================
  // REDIRECT RECRUITER
  // ========================================

  useEffect(() => {
    if (user?.role === 'recruiter') {
      navigate('/recruiter-home')
    }
  }, [user, navigate])

  // ========================================
  // FETCH JOBS
  // ========================================

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setJobsLoading(true)

        const response = await axios.get(
          'http://localhost:5000/api/jobs'
        )

        if (Array.isArray(response.data)) {
          setJobs(response.data)
        } else if (Array.isArray(response.data.jobs)) {
          setJobs(response.data.jobs)
        } else {
          setJobs([])
        }
      } catch (error) {
        console.log('Home jobs fetch error:', error)
        setJobs([])
      } finally {
        setJobsLoading(false)
      }
    }

    fetchJobs()
  }, [])

  return (
    <div>
      <Navbar />

      {/* ========================================
          HOME / HERO
      ======================================== */}

      <section className="home">
        <h1>
          Find Your Dream Job
        </h1>

        <p className="home-description">
          Discover the right opportunity and build
          your career with JobPortal.
        </p>

        <Link to="/jobs">
          <button
            type="button"
            className="apply-button"
          >
            Find Jobs
          </button>
        </Link>
      </section>

      {/* ========================================
          AVAILABLE JOBS
      ======================================== */}

      <section className="jobs-section">
        <h2>
          Available Jobs
        </h2>

        <p className="section-description">
          Explore jobs posted by recruiters on JobPortal.
        </p>

        {/* Loading */}

        {jobsLoading && (
          <div className="no-jobs">
            <h3>
              Loading Jobs...
            </h3>

            <p>
              Please wait while we load available jobs.
            </p>
          </div>
        )}

        {/* No Jobs */}

        {!jobsLoading && jobs.length === 0 && (
          <div className="no-jobs">
            <h3>
              No Jobs Available
            </h3>

            <p>
              Recruiters have not posted any jobs yet.
            </p>
          </div>
        )}

        {/* Jobs */}

        {!jobsLoading && jobs.length > 0 && (
          <div className="jobs-container">
            {jobs.map((job) => (
              <div
                className="job-card"
                key={job._id}
              >
                <h3>
                  {job.title}
                </h3>

                <p className="company">
                  {job.company}
                </p>

                <p>
                  📍 {job.location}
                </p>

                <p>
                  💼 {job.type}
                </p>

                <p>
                  💰 {job.salary}
                </p>

                <Link to={`/jobs/${job._id}`}>
                  <button
                    type="button"
                    className="view-job-button"
                  >
                    View Job
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* View All Jobs */}

        <div className="view-all-section">
          <h2>
            Explore More Jobs
          </h2>

          <p>
            Find more opportunities that match
            your skills and career goals.
          </p>

          <Link to="/jobs">
            <button type="button">
              View All Jobs
            </button>
          </Link>
        </div>
      </section>

      {/* ========================================
          WHY CHOOSE JOBPORTAL
      ======================================== */}

      <section className="why-section">
        <h2>
          Why Choose JobPortal?
        </h2>

        <div className="why-container">
          <div className="why-card">
            <h3>
              Find the Right Job
            </h3>

            <p>
              Search through job opportunities and
              find positions that match your skills
              and career goals.
            </p>
          </div>

          <div className="why-card">
            <h3>
              Easy Applications
            </h3>

            <p>
              Apply for jobs easily and keep track
              of your applications in one place.
            </p>
          </div>

          <div className="why-card">
            <h3>
              Recruiter Opportunities
            </h3>

            <p>
              Recruiters can post jobs and connect
              with suitable candidates through
              the platform.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================
          HOW IT WORKS
      ======================================== */}

      <section className="how-section">
        <h2>
          How It Works
        </h2>

        <div className="how-container">
          <div className="how-card">
            <div className="step-number">
              1
            </div>

            <h3>
              Create Account
            </h3>

            <p>
              Create your JobPortal account as a
              job seeker or recruiter.
            </p>
          </div>

          <div className="how-card">
            <div className="step-number">
              2
            </div>

            <h3>
              Find Jobs
            </h3>

            <p>
              Search and explore job opportunities
              that match your skills.
            </p>
          </div>

          <div className="how-card">
            <div className="step-number">
              3
            </div>

            <h3>
              Apply
            </h3>

            <p>
              Apply for suitable jobs and manage
              your applications.
            </p>
          </div>

          <div className="how-card">
            <div className="step-number">
              4
            </div>

            <h3>
              Get Hired
            </h3>

            <p>
              Connect with recruiters and move
              forward in your career.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================
          FOOTER
      ======================================== */}

      <footer className="footer">
        <p>
          © 2026 JobPortal. All rights reserved.
        </p>
      </footer>
    </div>
  )
}

// ========================================
// APP ROUTES
// ========================================

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/recruiter-home"
          element={<RecruiterHome />}
        />

        <Route
          path="/jobs"
          element={<Jobs />}
        />

        <Route
          path="/jobs/:id"
          element={<JobDetails />}
        />

        <Route
          path="/jobs/:id/apply"
          element={<ApplyJob />}
        />

        <Route
          path="/my-applications"
          element={<MyApplications />}
        />

        <Route
          path="/recruiter-dashboard"
          element={<RecruiterDashboard />}
        />

        <Route
          path="/recruiter-applications"
          element={<RecruiterApplications />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/companies"
          element={<Companies />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App