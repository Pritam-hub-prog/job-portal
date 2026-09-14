import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

import Navbar from '../components/Navbar'
import API_URL from '../api'

function JobDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)

  let user = null

  try {
    user = JSON.parse(localStorage.getItem('user'))
  } catch (error) {
    user = null
  }

  const isRecruiter = user?.role === 'recruiter'

  // ==============================
  // Fetch Job Details
  // ==============================

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true)

        const response = await axios.get(
          `${API_URL}/api/jobs/${id}`
        )

        console.log('Job details response:', response.data)

        if (response.data.job) {
          setJob(response.data.job)
        } else {
          setJob(response.data)
        }
      } catch (error) {
        console.log('Job details error:', error)
        setJob(null)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchJob()
    }
  }, [id])

  // ==============================
  // Loading
  // ==============================

  if (loading) {
    return (
      <div>
        <Navbar />

        <main className="job-details">
          <div className="job-details-card">
            <h1>Loading Job...</h1>

            <p>
              Please wait while we load the job details.
            </p>
          </div>
        </main>
      </div>
    )
  }

  // ==============================
  // Job Not Found
  // ==============================

  if (!job) {
    return (
      <div>
        <Navbar />

        <main className="auth-page">
          <div className="auth-card">
            <h1>Job Not Found</h1>

            <p className="auth-description">
              The job you are looking for does not exist.
            </p>

            <button
              className="apply-button"
              onClick={() => navigate('/jobs')}
            >
              Back to Jobs
            </button>
          </div>
        </main>
      </div>
    )
  }

  // ==============================
  // Convert Skills into Array
  // ==============================

  const skills = Array.isArray(job.skills)
    ? job.skills
    : (job.skills || '')
        .split(',')
        .map((skill) => skill.trim())
        .filter((skill) => skill)

  // ==============================
  // Main Page
  // ==============================

  return (
    <div>
      <Navbar />

      <main className="job-details">
        <div className="job-details-card">

          {/* Job Header */}

          <div className="job-details-header">
            <h1>{job.title}</h1>

            <h2>{job.company}</h2>
          </div>

          {/* Job Information */}

          <div className="job-info">
            <div className="job-info-item">
              <span>Location</span>

              <strong>
                {job.location}
              </strong>
            </div>

            <div className="job-info-item">
              <span>Job Type</span>

              <strong>
                {job.type}
              </strong>
            </div>

            <div className="job-info-item">
              <span>Salary</span>

              <strong>
                {job.salary}
              </strong>
            </div>
          </div>

          {/* Description */}

          <section className="job-details-section">
            <h2>Job Description</h2>

            <p className="description">
              {job.description}
            </p>
          </section>

          {/* Skills */}

          <section className="job-details-section">
            <h2>Required Skills</h2>

            {skills.length > 0 ? (
              <ul className="skills-list">
                {skills.map((skill, index) => (
                  <li key={index}>
                    {skill}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="description">
                No specific skills mentioned.
              </p>
            )}
          </section>

          {/* Job ID */}

          <p className="job-id">
            Job ID: {job._id}
          </p>

          {/* Apply Button */}

          {!isRecruiter && (
            <Link to={`/jobs/${job._id}/apply`}>
              <button className="apply-button">
                Apply Now
              </button>
            </Link>
          )}

          {/* Back */}

          <div className="back-link">
            <Link to="/jobs">
              ← Back to Jobs
            </Link>
          </div>

        </div>
      </main>
    </div>
  )
}

export default JobDetails