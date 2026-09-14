import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

function About() {
  return (
    <div>
      {/* Navbar */}

      <Navbar />

      {/* About Page */}

      <main className="about-page">
        <div className="about-container">

          {/* Header */}

          <div className="about-header">
            <h1>
              About JobPortal
            </h1>

            <p>
              Connecting talented people with the
              right career opportunities.
            </p>
          </div>

          {/* What is JobPortal */}

          <section className="about-section">

            <div className="about-section-number">
              01
            </div>

            <div className="about-section-content">

              <h2>
                What is JobPortal?
              </h2>

              <p>
                JobPortal is a web-based job recruitment
                platform that connects job seekers with
                recruiters.
              </p>

              <p>
                Job seekers can search for jobs, view job
                details and apply for suitable positions.
                Recruiters can create job postings, manage
                their jobs and connect with potential
                candidates.
              </p>

            </div>

          </section>

          {/* Job Seekers */}

          <section className="about-section">

            <div className="about-section-number">
              02
            </div>

            <div className="about-section-content">

              <h2>
                For Job Seekers
              </h2>

              <p>
                Job seekers can create an account, search
                for available jobs, view job information
                and submit applications.
              </p>

              <div className="about-feature-list">

                <div>
                  <span>✓</span>
                  Search available jobs
                </div>

                <div>
                  <span>✓</span>
                  View complete job details
                </div>

                <div>
                  <span>✓</span>
                  Apply for suitable positions
                </div>

                <div>
                  <span>✓</span>
                  Track submitted applications
                </div>

              </div>

            </div>

          </section>

          {/* Recruiters */}

          <section className="about-section">

            <div className="about-section-number">
              03
            </div>

            <div className="about-section-content">

              <h2>
                For Recruiters
              </h2>

              <p>
                Recruiters can create and manage job
                postings and connect with suitable
                candidates through the platform.
              </p>

              <div className="about-feature-list">

                <div>
                  <span>✓</span>
                  Post new job opportunities
                </div>

                <div>
                  <span>✓</span>
                  Manage posted jobs
                </div>

                <div>
                  <span>✓</span>
                  Receive candidate applications
                </div>

                <div>
                  <span>✓</span>
                  Find suitable candidates
                </div>

              </div>

            </div>

          </section>

          {/* Our Goal */}

          <section className="about-section about-goal">

            <div className="about-section-number">
              04
            </div>

            <div className="about-section-content">

              <h2>
                Our Goal
              </h2>

              <p>
                Our goal is to make the job search and
                recruitment process simple, organized and
                accessible for both job seekers and
                recruiters.
              </p>

            </div>

          </section>

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

export default About