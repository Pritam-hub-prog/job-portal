import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'

function RecruiterApplications() {
  const navigate = useNavigate()

  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)

  let user = null

  try {
    user = JSON.parse(localStorage.getItem('user'))
  } catch (error) {
    user = null
  }

  const token = localStorage.getItem('token')

  // =========================
  // Fetch Recruiter Applications
  // =========================

  useEffect(() => {
    const fetchApplications = async () => {
      if (!token) {
        navigate('/login')
        return
      }

      if (user?.role !== 'recruiter') {
        navigate('/jobs')
        return
      }

      try {
        const response = await axios.get(
          'http://https://job-portal-p5o9.onrender.com/api/applications/recruiter-applications',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        console.log(
          'Recruiter applications:',
          response.data
        )

        setApplications(
          response.data.applications || []
        )
      } catch (error) {
        console.log(
          'Recruiter applications error:',
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
  }, [navigate, token, user?.role])

  // =========================
  // Update Application Status
  // =========================

  const handleStatusChange = async (
    applicationId,
    newStatus
  ) => {
    try {
      setUpdatingId(applicationId)

      const response = await axios.put(
        `http://https://job-portal-p5o9.onrender.com/api/applications/status/${applicationId}`,
        {
          status: newStatus
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      console.log(
        'Status update response:',
        response.data
      )

      setApplications(
        (previousApplications) =>
          previousApplications.map((application) =>
            application._id === applicationId
              ? {
                  ...application,
                  status: newStatus
                }
              : application
          )
      )

      alert(
        response.data.message ||
          'Application status updated successfully.'
      )
    } catch (error) {
      console.log(
        'Status update error:',
        error
      )

      alert(
        error.response?.data?.message ||
          'Failed to update application status.'
      )
    } finally {
      setUpdatingId(null)
    }
  }

  // =========================
  // Status Class
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

  // =========================
  // Resume URL
  // =========================

  const getResumeUrl = (resumePath) => {
    if (!resumePath) {
      return ''
    }

    const cleanPath = resumePath.replace(/^\/+/, '')

    return `http://https://job-portal-p5o9.onrender.com/${cleanPath}`
  }

  return (
    <div>

      {/* =========================
          SHARED NAVBAR
      ========================= */}

      <Navbar />

      {/* =========================
          RECRUITER APPLICATIONS PAGE
      ========================= */}

      <main className="recruiter-applications-page">

        <div className="recruiter-applications-container">

          {/* Header */}

          <div className="recruiter-applications-header">

            <h1>
              Job Applications
            </h1>

            <p>
              Review applications submitted for your
              job postings and update their status.
            </p>

          </div>

          {/* =========================
              LOADING
          ========================= */}

          {loading && (
            <div className="recruiter-applications-message">

              <h2>
                Loading Applications...
              </h2>

              <p>
                Please wait while we load the applications.
              </p>

            </div>
          )}

          {/* =========================
              NO APPLICATIONS
          ========================= */}

          {!loading &&
            applications.length === 0 && (
              <div className="recruiter-applications-message">

                <h2>
                  No Applications Yet
                </h2>

                <p>
                  You have not received any applications
                  for your job postings.
                </p>

                <Link to="/recruiter-dashboard">
                  <button className="apply-button">
                    Go to Dashboard
                  </button>
                </Link>

              </div>
            )}

          {/* =========================
              APPLICATIONS
          ========================= */}

          {!loading &&
            applications.length > 0 && (
              <div className="recruiter-applications-list">

                {applications.map((application) => (

                  <div
                    className="recruiter-application-card"
                    key={application._id}
                  >

                    {/* =========================
                        HEADER
                    ========================= */}

                    <div className="recruiter-application-header">

                      <div>

                        <h2>
                          {application.fullName}
                        </h2>

                        <p>
                          Applied for{' '}
                          <strong>
                            {application.jobTitle}
                          </strong>
                        </p>

                        <span>
                          {application.company}
                        </span>

                      </div>

                      <span
                        className={`application-status ${getStatusClass(
                          application.status
                        )}`}
                      >
                        {application.status}
                      </span>

                    </div>

                    {/* =========================
                        APPLICANT INFORMATION
                    ========================= */}

                    <div className="applicant-info-grid">

                      <div className="applicant-info-item">
                        <span>
                          Email
                        </span>

                        <strong>
                          {application.email}
                        </strong>
                      </div>

                      <div className="applicant-info-item">
                        <span>
                          Phone
                        </span>

                        <strong>
                          {application.phone}
                        </strong>
                      </div>

                      <div className="applicant-info-item">
                        <span>
                          Location
                        </span>

                        <strong>
                          {application.currentLocation}
                        </strong>
                      </div>

                      <div className="applicant-info-item">
                        <span>
                          Qualification
                        </span>

                        <strong>
                          {application.highestQualification}
                        </strong>
                      </div>

                      <div className="applicant-info-item">
                        <span>
                          Experience
                        </span>

                        <strong>
                          {application.experience}
                        </strong>
                      </div>

                      <div className="applicant-info-item">
                        <span>
                          Graduation Year
                        </span>

                        <strong>
                          {application.graduationYear}
                        </strong>
                      </div>

                    </div>

                    {/* =========================
                        SKILLS
                    ========================= */}

                    <div className="applicant-section">

                      <h3>
                        Skills
                      </h3>

                      <p>
                        {application.skills ||
                          'Not provided'}
                      </p>

                    </div>

                    {/* =========================
                        ONLINE PROFILES
                    ========================= */}

                    <div className="applicant-section">

                      <h3>
                        Online Profiles
                      </h3>

                      <div className="applicant-links">

                        {application.linkedin && (
                          <a
                            href={application.linkedin}
                            target="_blank"
                            rel="noreferrer"
                          >
                            LinkedIn
                          </a>
                        )}

                        {application.github && (
                          <a
                            href={application.github}
                            target="_blank"
                            rel="noreferrer"
                          >
                            GitHub
                          </a>
                        )}

                        {application.portfolio && (
                          <a
                            href={application.portfolio}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Portfolio
                          </a>
                        )}

                        {!application.linkedin &&
                          !application.github &&
                          !application.portfolio && (
                            <span>
                              No online profiles provided.
                            </span>
                          )}

                      </div>

                    </div>

                    {/* =========================
                        COVER LETTER
                    ========================= */}

                    {application.coverLetter && (
                      <div className="applicant-section">

                        <h3>
                          Cover Letter
                        </h3>

                        <p className="applicant-text">
                          {application.coverLetter}
                        </p>

                      </div>
                    )}

                    {/* =========================
                        WHY HIRE YOU
                    ========================= */}

                    {application.whyHireYou && (
                      <div className="applicant-section">

                        <h3>
                          Why Should We Hire You?
                        </h3>

                        <p className="applicant-text">
                          {application.whyHireYou}
                        </p>

                      </div>
                    )}

                    {/* =========================
                        RESUME
                    ========================= */}

                    {application.resume && (
                      <div className="applicant-section">

                        <h3>
                          Resume
                        </h3>

                        <a
                          className="resume-link"
                          href={getResumeUrl(
                            application.resume
                          )}
                          target="_blank"
                          rel="noreferrer"
                        >
                          View Resume
                        </a>

                      </div>
                    )}

                    {/* =========================
                        STATUS
                    ========================= */}

                    <div className="application-status-section">

                      <div>

                        <label
                          htmlFor={`status-${application._id}`}
                        >
                          Application Status
                        </label>

                        <select
                          id={`status-${application._id}`}
                          value={application.status}
                          disabled={
                            updatingId ===
                            application._id
                          }
                          onChange={(e) =>
                            handleStatusChange(
                              application._id,
                              e.target.value
                            )
                          }
                        >

                          <option value="Applied">
                            Applied
                          </option>

                          <option value="Reviewing">
                            Reviewing
                          </option>

                          <option value="Shortlisted">
                            Shortlisted
                          </option>

                          <option value="Rejected">
                            Rejected
                          </option>

                        </select>

                      </div>

                      {updatingId ===
                        application._id && (
                        <span className="status-updating">
                          Updating...
                        </span>
                      )}

                    </div>

                    {/* =========================
                        FOOTER
                    ========================= */}

                    <div className="recruiter-application-footer">

                      Applied on:{' '}

                      {new Date(
                        application.createdAt
                      ).toLocaleDateString()}

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

export default RecruiterApplications