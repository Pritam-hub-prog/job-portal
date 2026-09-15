import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'

function Profile() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    qualification: '',
    skills: '',
    experience: '',
    linkedin: '',
    github: '',
    portfolio: '',
    company: ''
  })

  const token = localStorage.getItem('token')

  // =========================
  // Fetch Profile
  // =========================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!token) {
          navigate('/login')
          return
        }

        const response = await axios.get(
          'https://job-portal-p5o9.onrender.com/api/profile',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        const profileUser = response.data.user

        setUser(profileUser)

        setFormData({
          name: profileUser.name || '',
          email: profileUser.email || '',
          phone: profileUser.phone || '',
          location: profileUser.location || '',
          qualification: profileUser.qualification || '',
          skills: profileUser.skills || '',
          experience: profileUser.experience || '',
          linkedin: profileUser.linkedin || '',
          github: profileUser.github || '',
          portfolio: profileUser.portfolio || '',
          company: profileUser.company || ''
        })
      } catch (error) {
        console.log('Profile fetch error:', error)

        if (error.response?.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')

          navigate('/login')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [navigate, token])

  // =========================
  // Handle Input
  // =========================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  // =========================
  // Update Profile
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setSaving(true)

      const response = await axios.put(
        'https://job-portal-p5o9.onrender.com/api/profile',
        {
          name: formData.name,
          phone: formData.phone,
          location: formData.location,
          qualification: formData.qualification,
          skills: formData.skills,
          experience: formData.experience,
          linkedin: formData.linkedin,
          github: formData.github,
          portfolio: formData.portfolio,
          company: formData.company
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const updatedUser = response.data.user

      setUser(updatedUser)

      localStorage.setItem(
        'user',
        JSON.stringify(updatedUser)
      )

      alert('Profile updated successfully')
    } catch (error) {
      console.log('Profile update error:', error)

      alert(
        error.response?.data?.message ||
          'Unable to update profile'
      )
    } finally {
      setSaving(false)
    }
  }

  // =========================
  // Loading
  // =========================

  if (loading) {
    return (
      <div>
        <Navbar />

        <main className="profile-page">
          <div className="profile-message">
            Loading profile...
          </div>
        </main>
      </div>
    )
  }

  // =========================
  // Main Page
  // =========================

  return (
    <div>
      <Navbar />

      <main className="profile-page">

        <div className="profile-container">

          {/* Header */}

          <div className="profile-header">
            <h1>My Profile</h1>

            <p>
              Manage your personal information and
              professional details.
            </p>
          </div>

          <form
            className="profile-form"
            onSubmit={handleSubmit}
          >

            {/* =========================
                BASIC INFORMATION
            ========================= */}

            <section className="profile-section">

              <h2>Basic Information</h2>

              <div className="profile-form-row">

                <div className="form-group">

                  <label htmlFor="name">
                    Full Name *
                  </label>

                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />

                </div>

                <div className="form-group">

                  <label htmlFor="email">
                    Email Address
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    disabled
                  />

                  <small>
                    Email cannot be changed.
                  </small>

                </div>

              </div>

              <div className="profile-form-row">

                <div className="form-group">

                  <label htmlFor="phone">
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                  />

                </div>

                <div className="form-group">

                  <label htmlFor="location">
                    Location
                  </label>

                  <input
                    id="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, State"
                  />

                </div>

              </div>

            </section>

            {/* =========================
                PROFESSIONAL INFORMATION
            ========================= */}

            <section className="profile-section">

              <h2>Professional Information</h2>

              {user?.role === 'recruiter' && (
                <div className="form-group">

                  <label htmlFor="company">
                    Company
                  </label>

                  <input
                    id="company"
                    type="text"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Enter your company name"
                  />

                </div>
              )}

              <div className="profile-form-row">

                <div className="form-group">

                  <label htmlFor="qualification">
                    Highest Qualification
                  </label>

                  <input
                    id="qualification"
                    type="text"
                    value={formData.qualification}
                    onChange={handleChange}
                    placeholder="e.g. B.Tech, MBA"
                  />

                </div>

                <div className="form-group">

                  <label htmlFor="experience">
                    Experience
                  </label>

                  <input
                    id="experience"
                    type="text"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="e.g. Fresher, 2 years"
                  />

                </div>

              </div>

              <div className="form-group">

                <label htmlFor="skills">
                  Skills
                </label>

                <textarea
                  id="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="e.g. JavaScript, React, Node.js, MongoDB"
                />

                <small>
                  Separate multiple skills with commas.
                </small>

              </div>

            </section>

            {/* =========================
                ONLINE PROFILES
            ========================= */}

            <section className="profile-section">

              <h2>Online Profiles</h2>

              <div className="form-group">

                <label htmlFor="linkedin">
                  LinkedIn
                </label>

                <input
                  id="linkedin"
                  type="url"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/your-profile"
                />

              </div>

              <div className="profile-form-row">

                <div className="form-group">

                  <label htmlFor="github">
                    GitHub
                  </label>

                  <input
                    id="github"
                    type="url"
                    value={formData.github}
                    onChange={handleChange}
                    placeholder="https://github.com/username"
                  />

                </div>

                <div className="form-group">

                  <label htmlFor="portfolio">
                    Portfolio
                  </label>

                  <input
                    id="portfolio"
                    type="url"
                    value={formData.portfolio}
                    onChange={handleChange}
                    placeholder="https://yourportfolio.com"
                  />

                </div>

              </div>

            </section>

            {/* =========================
                ACTIONS
            ========================= */}

            <div className="profile-actions">

              <Link
                to={
                  user?.role === 'recruiter'
                    ? '/recruiter-home'
                    : '/'
                }
              >
                <button
                  type="button"
                  className="back-button"
                >
                  Cancel
                </button>
              </Link>

              <button
                type="submit"
                className="apply-button"
                disabled={saving}
              >
                {saving
                  ? 'Saving...'
                  : 'Save Profile'}
              </button>

            </div>

          </form>

        </div>

      </main>

      {/* Footer */}

      <footer className="footer">
        <p>
          © 2026 JobPortal. All rights reserved.
        </p>
      </footer>
    </div>
  )
}

export default Profile