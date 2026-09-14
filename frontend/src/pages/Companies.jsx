import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'

function Companies() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)

  // =========================
  // Fetch Companies
  // =========================

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/jobs/companies'
        )

        console.log('Companies response:', response.data)

        setCompanies(response.data || [])
      } catch (error) {
        console.log('Error fetching companies:', error)
        setCompanies([])
      } finally {
        setLoading(false)
      }
    }

    fetchCompanies()
  }, [])

  return (
    <div>
      {/* Navbar */}

      <Navbar />

      {/* Companies Page */}

      <main className="companies-page">
        <div className="companies-container">

          {/* Header */}

          <div className="companies-header">
            <h1>
              Companies
            </h1>

            <p>
              Explore companies hiring on JobPortal
              and discover your next career opportunity.
            </p>
          </div>

          {/* Companies Content */}

          {loading ? (
            <div className="companies-message">
              Loading companies...
            </div>
          ) : companies.length === 0 ? (
            <div className="companies-message">
              <h2>
                No Companies Available
              </h2>

              <p>
                There are no companies with active
                job listings at the moment.
              </p>
            </div>
          ) : (
            <div className="companies-grid">

              {companies.map((company, index) => (
                <div
                  className="company-card"
                  key={company.name || index}
                >

                  {/* Company Icon */}

                  <div className="company-icon">
                    {company.name
                      ?.charAt(0)
                      .toUpperCase() || 'C'}
                  </div>

                  {/* Company Name */}

                  <h2>
                    {company.name}
                  </h2>

                  {/* Location */}

                  <p className="company-location">
                    {company.location}
                  </p>

                  {/* Number of Jobs */}

                  <p className="company-jobs">
                    {company.jobs}{' '}
                    {company.jobs === 1
                      ? 'job available'
                      : 'jobs available'}
                  </p>

                  {/* View Jobs */}

                  <Link to="/jobs">
                    <button className="view-job-button">
                      View Jobs
                    </button>
                  </Link>

                </div>
              ))}

            </div>
          )}

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

export default Companies