import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

function RecruiterDashboard() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: '',
    salary: '',
    description: '',
    skills: ''
  })

  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])

  const [loading, setLoading] = useState(false)
  const [jobsLoading, setJobsLoading] = useState(true)
  const [applicationsLoading, setApplicationsLoading] =
    useState(true)

  const [editingJobId, setEditingJobId] = useState(null)

  const token = localStorage.getItem('token')

  // =========================
  // Authentication
  // =========================

  useEffect(() => {
    let user = null

    try {
      user = JSON.parse(localStorage.getItem('user'))
    } catch (error) {
      user = null
    }

    if (!token || !user) {
      alert('Please login first.')
      navigate('/login')
      return
    }

    if (user.role !== 'recruiter') {
      alert('Only recruiters can access this page.')
      navigate('/')
      return
    }

    fetchMyJobs()
    fetchApplications()
  }, [])

  // =========================
  // Form Change
  // =========================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // =========================
  // Fetch My Jobs
  // =========================

  const fetchMyJobs = async () => {
    try {
      setJobsLoading(true)

      const response = await axios.get(
        'http://localhost:5000/api/jobs/my-jobs',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      console.log('My jobs:', response.data)

      setJobs(response.data.jobs || [])
    } catch (error) {
      console.log('Fetch jobs error:', error)

      handleAuthError(error)
    } finally {
      setJobsLoading(false)
    }
  }

  // =========================
  // Fetch Applications
  // =========================

  const fetchApplications = async () => {
    try {
      setApplicationsLoading(true)

      const response = await axios.get(
        'http://localhost:5000/api/applications/recruiter-applications',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      console.log('Applications:', response.data)

      setApplications(response.data.applications || [])
    } catch (error) {
      console.log('Fetch applications error:', error)

      handleAuthError(error)
    } finally {
      setApplicationsLoading(false)
    }
  }

  // =========================
  // Authentication Error
  // =========================

  const handleAuthError = (error) => {
    if (error.response?.status === 401) {
      alert(
        'Your login session has expired. Please login again.'
      )

      localStorage.removeItem('token')
      localStorage.removeItem('user')

      navigate('/login')
      return
    }

    if (error.response?.data?.message) {
      alert(error.response.data.message)
    } else {
      alert(
        'Cannot connect to server. Please make sure the backend is running.'
      )
    }
  }

  // =========================
  // Post / Update Job
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)

      let response

      if (editingJobId) {
        response = await axios.put(
          `http://localhost:5000/api/jobs/${editingJobId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
      } else {
        response = await axios.post(
          'http://localhost:5000/api/jobs',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
      }

      alert(
        response.data.message ||
          (editingJobId
            ? 'Job updated successfully.'
            : 'Job posted successfully.')
      )

      resetForm()
      fetchMyJobs()
    } catch (error) {
      console.log('Post/update job error:', error)

      handleAuthError(error)
    } finally {
      setLoading(false)
    }
  }

  // =========================
  // Reset Form
  // =========================

  const resetForm = () => {
    setFormData({
      title: '',
      company: '',
      location: '',
      type: '',
      salary: '',
      description: '',
      skills: ''
    })

    setEditingJobId(null)
  }

  // =========================
  // Edit Job
  // =========================

  const handleEdit = (job) => {
    setEditingJobId(job._id)

    setFormData({
      title: job.title || '',
      company: job.company || '',
      location: job.location || '',
      type: job.type || '',
      salary: job.salary || '',
      description: job.description || '',
      skills: Array.isArray(job.skills)
        ? job.skills.join(', ')
        : job.skills || ''
    })

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // =========================
  // Cancel Edit
  // =========================

  const handleCancelEdit = () => {
    resetForm()
  }

  // =========================
  // Delete Job
  // =========================

  const handleDelete = async (jobId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this job?'
    )

    if (!confirmDelete) {
      return
    }

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/jobs/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      alert(
        response.data.message ||
          'Job deleted successfully.'
      )

      if (editingJobId === jobId) {
        resetForm()
      }

      fetchMyJobs()
    } catch (error) {
      console.log('Delete job error:', error)

      handleAuthError(error)
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

  return (
    <div>

      {/* =========================
          Navbar
      ========================= */}

      <nav className="navbar">
        <h2 className="logo">
          JobPortal
        </h2>

        <div className="nav-links">

          <Link to="/recruiter-home">
            Home
          </Link>

          <Link to="/jobs">
            Jobs
          </Link>

          <Link to="/recruiter-dashboard">
            Dashboard
          </Link>

          <Link to="/recruiter-applications">
            Applications
          </Link>

          {/* Profile added here */}
          <Link to="/profile">
            Profile
          </Link>

          <Link to="/companies">
            Companies
          </Link>

          <Link to="/about">
            About
          </Link>

          <button
            className="nav-logout"
            onClick={() => {
              localStorage.removeItem('token')
              localStorage.removeItem('user')
              navigate('/login')
            }}
          >
            Logout
          </button>

        </div>
      </nav>

      {/* =========================
          Main Dashboard
      ========================= */}

      <main className="recruiter-page">
        <div className="recruiter-container">

          {/* Header */}

          <div className="recruiter-header">
            <h1>
              Recruiter Dashboard
            </h1>

            <p>
              Post jobs and manage your job listings.
            </p>
          </div>

          {/* =========================
              Dashboard Stats
          ========================= */}

          <div className="recruiter-stats">

            <div className="recruiter-stat-card">
              <span>
                Total Jobs
              </span>

              <strong>
                {jobs.length}
              </strong>
            </div>

            <div className="recruiter-stat-card">
              <span>
                Applications
              </span>

              <strong>
                {applications.length}
              </strong>
            </div>

            <div className="recruiter-stat-card">
              <span>
                Shortlisted
              </span>

              <strong>
                {
                  applications.filter(
                    (application) =>
                      application.status === 'Shortlisted'
                  ).length
                }
              </strong>
            </div>

          </div>

          {/* =========================
              Post / Edit Job
          ========================= */}

          <section className="post-job-card">

            <h2>
              {editingJobId
                ? 'Edit Job'
                : 'Post a New Job'}
            </h2>

            {editingJobId && (
              <p>
                Update the job information below and
                click Update Job.
              </p>
            )}

            <form onSubmit={handleSubmit}>

              <div className="recruiter-form-row">

                <div className="form-group">
                  <label htmlFor="title">
                    Job Title *
                  </label>

                  <input
                    id="title"
                    name="title"
                    type="text"
                    placeholder="Example: Frontend Developer"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="company">
                    Company *
                  </label>

                  <input
                    id="company"
                    name="company"
                    type="text"
                    placeholder="Example: Tech Solutions"
                    value={formData.company}
                    onChange={handleChange}
                    required
                  />
                </div>

              </div>

              <div className="recruiter-form-row">

                <div className="form-group">
                  <label htmlFor="location">
                    Location *
                  </label>

                  <input
                    id="location"
                    name="location"
                    type="text"
                    placeholder="Example: Bangalore"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="type">
                    Job Type *
                  </label>

                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select Job Type
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
                </div>

              </div>

              <div className="form-group">
                <label htmlFor="salary">
                  Salary *
                </label>

                <input
                  id="salary"
                  name="salary"
                  type="text"
                  placeholder="Example: ₹6 - 10 LPA"
                  value={formData.salary}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">
                  Job Description *
                </label>

                <textarea
                  id="description"
                  name="description"
                  placeholder="Describe the job responsibilities..."
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="skills">
                  Required Skills *
                </label>

                <input
                  id="skills"
                  name="skills"
                  type="text"
                  placeholder="Example: React, JavaScript, Node.js, MongoDB"
                  value={formData.skills}
                  onChange={handleChange}
                  required
                />

                <small>
                  Separate skills using commas.
                </small>
              </div>

              <div className="dashboard-form-actions">

                <button
                  type="submit"
                  className="apply-button"
                  disabled={loading}
                >
                  {loading
                    ? editingJobId
                      ? 'Updating Job...'
                      : 'Posting Job...'
                    : editingJobId
                    ? 'Update Job'
                    : 'Post Job'}
                </button>

                {editingJobId && (
                  <button
                    type="button"
                    className="clear-button"
                    onClick={handleCancelEdit}
                  >
                    Cancel Edit
                  </button>
                )}

              </div>

            </form>
          </section>

          {/* =========================
              My Posted Jobs
          ========================= */}

          <section className="my-jobs-section">

            <div className="section-heading-row">
              <div>
                <h2>
                  My Posted Jobs
                </h2>

                <p>
                  Manage the jobs you have posted.
                </p>
              </div>

              <Link to="/jobs">
                <button className="view-job-button">
                  View All Jobs
                </button>
              </Link>
            </div>

            {jobsLoading ? (

              <div className="dashboard-message">
                <p>
                  Loading your jobs...
                </p>
              </div>

            ) : jobs.length === 0 ? (

              <div className="dashboard-message">

                <h3>
                  No Jobs Posted Yet
                </h3>

                <p>
                  Use the form above to post your first job.
                </p>

              </div>

            ) : (

              <div className="recruiter-jobs-list">

                {jobs.map((job) => (

                  <div
                    className="recruiter-job-card"
                    key={job._id}
                  >

                    <div className="recruiter-job-info">

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

                      <p className="job-description">
                        {job.description}
                      </p>

                      <p>
                        <strong>
                          Skills:
                        </strong>{' '}
                        {Array.isArray(job.skills)
                          ? job.skills.join(', ')
                          : job.skills}
                      </p>

                    </div>

                    <div className="recruiter-job-actions">

                      <Link to={`/jobs/${job._id}`}>
                        <button className="view-job-button">
                          View Job
                        </button>
                      </Link>

                      <button
                        className="view-job-button"
                        onClick={() =>
                          handleEdit(job)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-job-button"
                        onClick={() =>
                          handleDelete(job._id)
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </section>

          {/* =========================
              Applications Summary
          ========================= */}

          <section className="my-jobs-section">

            <div className="section-heading-row">

              <div>
                <h2>
                  Applications Received
                </h2>

                <p>
                  Check applicants for your posted jobs.
                </p>
              </div>

              <Link to="/recruiter-applications">
                <button className="view-job-button">
                  View All Applications
                </button>
              </Link>

            </div>

            {applicationsLoading ? (

              <div className="dashboard-message">
                <p>
                  Loading applications...
                </p>
              </div>

            ) : applications.length === 0 ? (

              <div className="dashboard-message">

                <h3>
                  No Applications Yet
                </h3>

                <p>
                  Applications from job seekers will appear here.
                </p>

              </div>

            ) : (

              <div className="applications-list">

                {applications.slice(0, 5).map(
                  (application) => (

                    <div
                      className="application-card"
                      key={application._id}
                    >

                      <div className="application-card-header">

                        <div>

                          <h2>
                            {application.fullName}
                          </h2>

                          <p className="company">
                            Applied for:{' '}
                            {application.jobTitle}
                          </p>

                          <p className="company">
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

                      <div className="application-details">

                        <div>
                          <strong>
                            Email
                          </strong>

                          <p>
                            {application.email}
                          </p>
                        </div>

                        <div>
                          <strong>
                            Experience
                          </strong>

                          <p>
                            {application.experience}
                          </p>
                        </div>

                        <div>
                          <strong>
                            Applied On
                          </strong>

                          <p>
                            {new Date(
                              application.createdAt
                            ).toLocaleDateString()}
                          </p>
                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </section>

        </div>
      </main>

    </div>
  )
}

export default RecruiterDashboard