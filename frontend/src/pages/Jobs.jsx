import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'

function Jobs() {
  const [jobs, setJobs] = useState([])
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const [jobType, setJobType] = useState('')
  const [loading, setLoading] = useState(true)

  // =========================
  // Get Logged-in User
  // =========================

  let user = null

  try {
    user = JSON.parse(localStorage.getItem('user'))
  } catch (error) {
    user = null
  }

  const isRecruiter = user?.role === 'recruiter'

  // =========================
  // Fetch Jobs
  // =========================

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true)

        const response = await axios.get(
          'http://localhost:5000/api/jobs'
        )

        console.log('Jobs response:', response.data)

        if (Array.isArray(response.data)) {
          setJobs(response.data)
        } else if (Array.isArray(response.data.jobs)) {
          setJobs(response.data.jobs)
        } else {
          setJobs([])
        }
      } catch (error) {
        console.log('Fetch jobs error:', error)

        alert(
          'Cannot load jobs. Please make sure the backend is running.'
        )

        setJobs([])
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  // =========================
  // Filter Jobs
  // =========================

  const filteredJobs = jobs.filter((job) => {
    const skillsText = Array.isArray(job.skills)
      ? job.skills.join(' ')
      : job.skills || ''

    const searchText = search.toLowerCase().trim()
    const locationText = location.toLowerCase().trim()

    const searchMatch =
      job.title?.toLowerCase().includes(searchText) ||
      job.company?.toLowerCase().includes(searchText) ||
      skillsText.toLowerCase().includes(searchText)

    const locationMatch =
      job.location?.toLowerCase().includes(locationText)

    const typeMatch =
      jobType === '' || job.type === jobType

    return (
      searchMatch &&
      locationMatch &&
      typeMatch
    )
  })

  // =========================
  // Clear Filters
  // =========================

  const handleClear = () => {
    setSearch('')
    setLocation('')
    setJobType('')
  }

  return (
    <div>
      {/* =========================
          SHARED NAVBAR
      ========================= */}

      <Navbar />

      {/* =========================
          JOBS PAGE
      ========================= */}

      <main className="jobs-page">
        <div className="jobs-page-container">

          {/* Heading */}

          <h1>
            {isRecruiter
              ? 'See Jobs'
              : 'Find Jobs'}
          </h1>

          <p className="jobs-description">
            {isRecruiter
              ? 'View jobs posted by recruiters.'
              : 'Search and find jobs that match your skills.'}
          </p>

          {/* =========================
              SEARCH AND FILTERS
          ========================= */}

          <div className="jobs-filter">

            <input
              type="text"
              placeholder="Job title or company"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) =>
                setLocation(e.target.value)
              }
            />

            <select
              value={jobType}
              onChange={(e) =>
                setJobType(e.target.value)
              }
            >
              <option value="">
                All Job Types
              </option>

              <option value="Full Time">
                Full Time
              </option>

              <option value="Part Time">
                Part Time
              </option>

              <option value="Internship">
                Internship
              </option>
            </select>

            <button
              type="button"
              className="clear-button"
              onClick={handleClear}
            >
              Clear
            </button>

          </div>

          {/* =========================
              AVAILABLE JOBS
          ========================= */}

          <h2 className="available-jobs-title">
            Available Jobs ({filteredJobs.length})
          </h2>

          {/* Loading */}

          {loading && (
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

          {!loading &&
            filteredJobs.length === 0 && (
              <div className="no-jobs">
                <h3>
                  No Jobs Found
                </h3>

                <p>
                  Try changing your search or filters.
                </p>
              </div>
            )}

          {/* =========================
              JOBS CONTAINER
          ========================= */}

          {!loading &&
            filteredJobs.length > 0 && (
              <div className="jobs-container">

                {filteredJobs.map((job) => (

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

                    {/* View Job */}

                    <Link
                      to={`/jobs/${job._id}`}
                    >
                      <button
                        type="button"
                      >
                        View Job
                      </button>
                    </Link>

                    {/* Job seekers can apply */}

                    {!isRecruiter && (
                      <Link
                        to={`/jobs/${job._id}/apply`}
                      >
                        <button
                          type="button"
                          className="apply-button"
                        >
                          Apply Now
                        </button>
                      </Link>
                    )}

                  </div>

                ))}

              </div>
            )}

        </div>
      </main>
    </div>
  )
}

export default Jobs