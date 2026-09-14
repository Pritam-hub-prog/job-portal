import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import API_URL from '../api'

function ApplyJob() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [job, setJob] = useState(null)
  const [jobLoading, setJobLoading] = useState(true)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    currentLocation: '',
    dateOfBirth: '',
    gender: '',

    highestQualification: '',
    college: '',
    graduationYear: '',

    experience: '',
    currentJob: '',
    expectedSalary: '',
    noticePeriod: '',
    skills: '',

    linkedin: '',
    github: '',
    portfolio: '',

    coverLetter: '',
    whyHireYou: ''
  })

  const [resumeFile, setResumeFile] = useState(null)

  // Get job details
  useEffect(() => {
    const fetchJob = async () => {
      try {
        setJobLoading(true)

        const response = await axios.get(
          `${API_URL}/api/jobs/${id}`
        )

        console.log('Apply job response:', response.data)

        if (response.data.job) {
          setJob(response.data.job)
        } else {
          setJob(response.data)
        }
      } catch (error) {
        console.log('Fetch apply job error:', error)
        setJob(null)
      } finally {
        setJobLoading(false)
      }
    }

    if (id) {
      fetchJob()
    }
  }, [id])

  // Handle form inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Handle resume upload
  const handleResumeChange = (e) => {
    const file = e.target.files[0]

    if (!file) {
      setResumeFile(null)
      return
    }

    if (file.type !== 'application/pdf') {
      alert('Please select a PDF file only.')
      e.target.value = ''
      setResumeFile(null)
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Resume file must be less than 5 MB.')
      e.target.value = ''
      setResumeFile(null)
      return
    }

    setResumeFile(file)
  }

  // Submit application
  const handleSubmit = async (e) => {
    e.preventDefault()

    const token = localStorage.getItem('token')

    if (!token) {
      alert('Please login before applying for a job.')
      navigate('/login')
      return
    }

    if (!job) {
      alert('Job not found.')
      return
    }

    if (!resumeFile) {
      alert('Please upload your resume.')
      return
    }

    try {
      setLoading(true)

      const applicationData = new FormData()

      applicationData.append('jobId', job._id)
      applicationData.append('jobTitle', job.title)
      applicationData.append('company', job.company)

      Object.keys(formData).forEach((key) => {
        applicationData.append(key, formData[key])
      })

      applicationData.append('resume', resumeFile)

      const response = await axios.post(
        `${API_URL}/api/applications`,
        applicationData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      console.log('Application response:', response.data)

      alert(
        response.data.message ||
          'Application submitted successfully!'
      )

      navigate(`/jobs/${id}`)
    } catch (error) {
      console.log('Application error:', error)

      if (error.response) {
        if (error.response.status === 401) {
          alert(
            'Your login session has expired. Please login again.'
          )

          localStorage.removeItem('token')
          localStorage.removeItem('user')

          navigate('/login')
        } else {
          alert(
            error.response.data.message ||
              'Failed to submit application.'
          )
        }
      } else {
        alert(
          'Cannot connect to server. Please make sure the backend is running.'
        )
      }
    } finally {
      setLoading(false)
    }
  }

  // Loading screen
  if (jobLoading) {
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
            <h1>Loading Job...</h1>

            <p className="auth-description">
              Please wait while we load the job details.
            </p>
          </div>
        </main>
      </div>
    )
  }

  // Job not found
  if (!job) {
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
            <h1>Job Not Found</h1>

            <p className="auth-description">
              The job you are trying to apply for does not exist.
            </p>

            <Link to="/jobs">
              <button className="apply-button">
                Back to Jobs
              </button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <h2 className="logo">JobPortal</h2>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/jobs">Jobs</Link>
          <Link to="/my-applications">
            My Applications
          </Link>
          <Link to="/companies">Companies</Link>
          <Link to="/about">About</Link>
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
        </div>
      </nav>

      {/* Application Page */}
      <main className="apply-page">
        <div className="apply-container">

          {/* Page Heading */}
          <div className="apply-header">
            <h1>Apply for Job</h1>

            <p>
              Complete the form below to apply for this position.
            </p>
          </div>

          {/* Job Information */}
          <div className="job-apply-info">
            <h2>{job.title}</h2>

            <p className="company">
              {job.company}
            </p>

            <p>📍 {job.location}</p>
            <p>💼 {job.type}</p>
            <p>💰 {job.salary}</p>
          </div>

          {/* Application Form */}
          <form
            className="application-form"
            onSubmit={handleSubmit}
          >

            {/* Personal Information */}
            <div className="form-section">
              <h2>Personal Information</h2>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fullName">
                    Full Name *
                  </label>

                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    Email Address *
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">
                    Phone Number *
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="currentLocation">
                    Current Location *
                  </label>

                  <input
                    id="currentLocation"
                    name="currentLocation"
                    type="text"
                    placeholder="City, State"
                    value={formData.currentLocation}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="dateOfBirth">
                    Date of Birth
                  </label>

                  <input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="gender">
                    Gender
                  </label>

                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">
                      Select Gender
                    </option>

                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">
                      Prefer not to say
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="form-section">
              <h2>Education</h2>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="highestQualification">
                    Highest Qualification *
                  </label>

                  <select
                    id="highestQualification"
                    name="highestQualification"
                    value={formData.highestQualification}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select Qualification
                    </option>

                    <option value="10th">10th</option>
                    <option value="12th">12th</option>
                    <option value="Diploma">Diploma</option>
                    <option value="BCA">BCA</option>
                    <option value="B.Tech">B.Tech</option>
                    <option value="BE">BE</option>
                    <option value="B.Sc">B.Sc</option>
                    <option value="MCA">MCA</option>
                    <option value="M.Tech">M.Tech</option>
                    <option value="MBA">MBA</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="college">
                    College / University *
                  </label>

                  <input
                    id="college"
                    name="college"
                    type="text"
                    placeholder="Enter college or university"
                    value={formData.college}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="graduationYear">
                  Graduation Year *
                </label>

                <input
                  id="graduationYear"
                  name="graduationYear"
                  type="text"
                  placeholder="Example: 2026"
                  value={formData.graduationYear}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Professional Information */}
            <div className="form-section">
              <h2>Professional Information</h2>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="experience">
                    Experience *
                  </label>

                  <select
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select Experience
                    </option>

                    <option value="Fresher">
                      Fresher
                    </option>

                    <option value="0-1 years">
                      0-1 years
                    </option>

                    <option value="1-2 years">
                      1-2 years
                    </option>

                    <option value="2-3 years">
                      2-3 years
                    </option>

                    <option value="3-5 years">
                      3-5 years
                    </option>

                    <option value="5+ years">
                      5+ years
                    </option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="currentJob">
                    Current Job
                  </label>

                  <input
                    id="currentJob"
                    name="currentJob"
                    type="text"
                    placeholder="Current job title"
                    value={formData.currentJob}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="expectedSalary">
                    Expected Salary
                  </label>

                  <input
                    id="expectedSalary"
                    name="expectedSalary"
                    type="text"
                    placeholder="Example: ₹8 LPA"
                    value={formData.expectedSalary}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="noticePeriod">
                    Notice Period
                  </label>

                  <select
                    id="noticePeriod"
                    name="noticePeriod"
                    value={formData.noticePeriod}
                    onChange={handleChange}
                  >
                    <option value="">
                      Select Notice Period
                    </option>

                    <option value="Immediate">
                      Immediate
                    </option>

                    <option value="15 days">
                      15 days
                    </option>

                    <option value="30 days">
                      30 days
                    </option>

                    <option value="60 days">
                      60 days
                    </option>

                    <option value="90 days">
                      90 days
                    </option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="skills">
                  Skills *
                </label>

                <textarea
                  id="skills"
                  name="skills"
                  placeholder="Example: React, JavaScript, Node.js, Express, MongoDB"
                  value={formData.skills}
                  onChange={handleChange}
                  required
                  rows="4"
                />
              </div>
            </div>

            {/* Online Profiles */}
            <div className="form-section">
              <h2>Online Profiles</h2>

              <div className="form-group">
                <label htmlFor="linkedin">
                  LinkedIn Profile
                </label>

                <input
                  id="linkedin"
                  name="linkedin"
                  type="url"
                  placeholder="https://linkedin.com/in/your-profile"
                  value={formData.linkedin}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="github">
                  GitHub Profile
                </label>

                <input
                  id="github"
                  name="github"
                  type="url"
                  placeholder="https://github.com/your-username"
                  value={formData.github}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="portfolio">
                  Portfolio Website
                </label>

                <input
                  id="portfolio"
                  name="portfolio"
                  type="url"
                  placeholder="https://yourportfolio.com"
                  value={formData.portfolio}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Application Details */}
            <div className="form-section">
              <h2>Application Details</h2>

              <div className="form-group">
                <label htmlFor="resume">
                  Resume (PDF) *
                </label>

                <input
                  id="resume"
                  name="resume"
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleResumeChange}
                  required
                />

                <small>
                  Upload your resume in PDF format.
                  Maximum size: 5 MB.
                </small>

                {resumeFile && (
                  <small>
                    Selected file: {resumeFile.name}
                  </small>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="coverLetter">
                  Cover Letter
                </label>

                <textarea
                  id="coverLetter"
                  name="coverLetter"
                  placeholder="Write your cover letter..."
                  value={formData.coverLetter}
                  onChange={handleChange}
                  rows="6"
                />
              </div>

              <div className="form-group">
                <label htmlFor="whyHireYou">
                  Why should we hire you?
                </label>

                <textarea
                  id="whyHireYou"
                  name="whyHireYou"
                  placeholder="Tell us why you are a good fit for this position..."
                  value={formData.whyHireYou}
                  onChange={handleChange}
                  rows="6"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="application-actions">
              <Link to={`/jobs/${id}`}>
                <button
                  type="button"
                  className="back-button"
                >
                  Back to Job
                </button>
              </Link>

              <button
                type="submit"
                className="apply-button"
                disabled={loading}
              >
                {loading
                  ? 'Submitting Application...'
                  : 'Submit Application'}
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  )
}

export default ApplyJob