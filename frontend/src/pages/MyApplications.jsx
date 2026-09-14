import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'

function MyApplications() {
  const navigate = useNavigate()

  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  const token = localStorage.getItem('token')

  // =========================
  // Fetch My Applications
  // =========================

  useEffect(() => {
    const fetchApplications = async () => {
      if (!token) {
        navigate('/login')
        return
      }

      try {
        const response = await axios.get(
          'http://localhost:5000/api/applications/my-applications',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        console.log(
          'My applications response:',
          response.data
        )

        setApplications(
          response.data.applications || []
        )
      } catch (error) {
        console.log(
          'My applications error:',
          error
        )

        if (error.response?.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')

          navigate('/login')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [navigate, token])

  // =========================
  // Application Status Class
  // =========================

  const getStatusClass = (status) => {
    switch (status) {
      case 'Shortlisted':
        return 'status-shortlisted'

      case 'Rejected':
        return 'status-rejected'

      case 'Reviewing':
        return 'status-reviewing'

      default:
        return 'status-applied'
    }
  }

  return (
    <div>

      {/* =========================
          SHARED NAVBAR
      ========================= */}

      <Navbar />

      {/* =========================
          APPLICATIONS PAGE
      ========================= */}

      <main className="applications-page">
        <div className="applications-container">

          {/* Header */}

          <div className="applications-header">
            <h1>
              My Applications
            </h1>

            <p>
              Track the jobs you have applied for and
              check your application status.
            </p>
          </div>

          {/* =========================
              LOADING
          ========================= */}

          {loading && (
            <div className="applications-message">

              <h2>
                Loading Applications...
              </h2>

              <p>
                Please wait while we load your applications.
              </p>

            </div>
          )}

          {/* =========================
              NO APPLICATIONS
          ========================= */}

          {!loading &&
            applications.length === 0 && (
              <div className="applications-message">

                <h2>
                  No Applications Yet
                </h2>

                <p>
                  You have not applied for any jobs yet.
                </p>

                <Link to="/jobs">
                  <button className="apply-button">
                    Find Jobs
                  </button>
                </Link>

              </div>
            )}

          {/* =========================
              APPLICATIONS
          ========================= */}

          {!loading &&
            applications.length > 0 && (
              <div className="applications-list">

                {applications.map((application) => (

                  <div
                    className="application-card"
                    key={application._id}
                  >

                    {/* Application Header */}

                    <div className="application-card-header">

                      <div>

                        <h2>
                          {application.jobTitle}
                        </h2>

                        <p className="application-company">
                          {application.company}
                        </p>

                      </div>

                      <span
                        className={`application-status ${getStatusClass(
                          application.status
                        )}`}
                      >
                        {application.status}
                      </span>

                    </div>

                    {/* Application Details */}

                    <div className="application-details">

                      <div className="application-detail-item">

                        <span>
                          Applied On
                        </span>

                        <strong>
                          {new Date(
                            application.createdAt
                          ).toLocaleDateString()}
                        </strong>

                      </div>

                      <div className="application-detail-item">

                        <span>
                          Email
                        </span>

                        <strong>
                          {application.email}
                        </strong>

                      </div>

                      <div className="application-detail-item">

                        <span>
                          Experience
                        </span>

                        <strong>
                          {application.experience}
                        </strong>

                      </div>

                    </div>

                    {/* Application Footer */}

                    <div className="application-card-footer">

                      <span>
                        Application ID:{' '}
                        {application._id}
                      </span>

                    </div>

                  </div>

                ))}

              </div>
            )}

        </div>
      </main>

    </div>
  )
}

export default MyApplications