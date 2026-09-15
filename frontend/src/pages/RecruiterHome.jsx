import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'

function RecruiterHome() {
  const navigate = useNavigate()

  const [myJobs, setMyJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [applicationsLoading, setApplicationsLoading] =
    useState(true)

  let user = null

  try {
    user = JSON.parse(localStorage.getItem('user'))
  } catch (error) {
    user = null
  }

  const recruiterName = user?.name || 'Recruiter'

  // =========================
  // Fetch Recruiter's Jobs
  // =========================

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        const token = localStorage.getItem('token')

        if (!token) {
          navigate('/login')
          return
        }

        const response = await axios.get(
          'https://job-portal-p5o9.onrender.com/api/jobs/my-jobs',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        console.log(
          'Recruiter jobs response:',
          response.data
        )

        if (Array.isArray(response.data)) {
          setMyJobs(response.data)
        } else {
          setMyJobs(response.data.jobs || [])
        }
      } catch (error) {
        console.log(
          'Error fetching recruiter jobs:',
          error
        )

        if (error.response?.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')

          navigate('/login')
        }

        setMyJobs([])
      } finally {
        setLoading(false)
      }
    }

    if (user?.role === 'recruiter') {
      fetchMyJobs()
    } else {
      setLoading(false)
      navigate('/')
    }
  }, [navigate])

  // =========================
  // Fetch Applications
  // =========================

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('token')

        if (!token) {
          navigate('/login')
          return
        }

        const response = await axios.get(
          'https://job-portal-p5o9.onrender.com/api/applications/recruiter-applications',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        console.log(
          'Recruiter applications response:',
          response.data
        )

        setApplications(
          response.data.applications || []
        )
      } catch (error) {
        console.log(
          'Error fetching applications:',
          error
        )

        if (error.response?.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')

          navigate('/login')
        }

        setApplications([])
      } finally {
        setApplicationsLoading(false)
      }
    }

    if (user?.role === 'recruiter') {
      fetchApplications()
    } else {
      setApplicationsLoading(false)
    }
  }, [navigate])

  // =========================
  // Shortlisted Count
  // =========================

  const shortlistedCount = applications.filter(
    (application) =>
      application.status === 'Shortlisted'
  ).length

  return (
    <div>

      {/* =========================
          SHARED NAVBAR
      ========================= */}

      <Navbar />

      {/* =========================
          RECRUITER HOME
      ========================= */}

      <main className="recruiter-home">

        <div className="recruiter-home-container">

          {/* =========================
              WELCOME
          ========================= */}

          <section className="recruiter-welcome">

            <h1>
              Welcome back, {recruiterName}!
            </h1>

            <p>
              Manage your hiring process and find
              the right candidates for your company.
            </p>

            <Link to="/recruiter-dashboard">
              <button className="apply-button">
                Post a New Job
              </button>
            </Link>

          </section>

          {/* =========================
              HIRING OVERVIEW
          ========================= */}

          <section className="recruiter-overview">

            <div className="recruiter-section-header">

              <h2>
                Hiring Overview
              </h2>

              <p>
                Keep track of your recruitment activities.
              </p>

            </div>

            <div className="recruiter-overview-container">

              {/* Posted Jobs */}

              <div className="recruiter-overview-card">

                <h3>
                  Posted Jobs
                </h3>

                <p className="overview-number">
                  {loading
                    ? '...'
                    : myJobs.length}
                </p>

                <p>
                  Jobs you have posted
                </p>

              </div>

              {/* Applications */}

              <div className="recruiter-overview-card">

                <h3>
                  Applications
                </h3>

                <p className="overview-number">
                  {applicationsLoading
                    ? '...'
                    : applications.length}
                </p>

                <p>
                  Applications received
                </p>

              </div>

              {/* Shortlisted */}

              <div className="recruiter-overview-card">

                <h3>
                  Shortlisted
                </h3>

                <p className="overview-number">
                  {applicationsLoading
                    ? '...'
                    : shortlistedCount}
                </p>

                <p>
                  Candidates shortlisted
                </p>

              </div>

            </div>

          </section>

          {/* =========================
              HOW HIRING WORKS
          ========================= */}

          <section className="recruiter-start-section">

            <div className="recruiter-section-header">

              <h2>
                How Hiring Works
              </h2>

              <p>
                Start hiring candidates through
                JobPortal in a few simple steps.
              </p>

            </div>

            <div className="recruiter-steps">

              {/* Step 1 */}

              <div className="recruiter-step-card">

                <div className="step-number">
                  1
                </div>

                <h3>
                  Post a Job
                </h3>

                <p>
                  Create a job listing with the required
                  skills, salary and job details.
                </p>

              </div>

              {/* Step 2 */}

              <div className="recruiter-step-card">

                <div className="step-number">
                  2
                </div>

                <h3>
                  Receive Applications
                </h3>

                <p>
                  Job seekers can find your job and
                  submit their applications.
                </p>

              </div>

              {/* Step 3 */}

              <div className="recruiter-step-card">

                <div className="step-number">
                  3
                </div>

                <h3>
                  Review Candidates
                </h3>

                <p>
                  Review candidate information,
                  experience and skills.
                </p>

              </div>

              {/* Step 4 */}

              <div className="recruiter-step-card">

                <div className="step-number">
                  4
                </div>

                <h3>
                  Hire the Best
                </h3>

                <p>
                  Shortlist suitable candidates and
                  select the right person for the job.
                </p>

              </div>

            </div>

          </section>

          {/* =========================
              QUICK ACTIONS
          ========================= */}

          <section className="recruiter-actions-section">

            <div className="recruiter-section-header">

              <h2>
                Quick Actions
              </h2>

              <p>
                Quickly access your main recruiter tools.
              </p>

            </div>

            <div className="recruiter-actions">

              <Link to="/recruiter-dashboard">
                <button className="apply-button">
                  Manage Jobs
                </button>
              </Link>

              <Link to="/recruiter-applications">
                <button className="apply-button">
                  View Applications
                </button>
              </Link>

            </div>

          </section>

        </div>

      </main>

      {/* =========================
          FOOTER
      ========================= */}

      <footer className="footer">

        <p>
          © 2026 JobPortal. All rights reserved.
        </p>

      </footer>

    </div>
  )
}

export default RecruiterHome