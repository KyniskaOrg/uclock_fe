import { CContainer, CRow, CCol, CButton, CCarousel, CCarouselItem } from '@coreui/react'
import React, { useEffect, useState } from 'react'

import logo from '../../../assets/images/logo.svg'
import bg from '../../../assets/images/bg.jpg'
import timesheet from '../../../assets/images/timesheet.png'
import report from '../../../assets/images/report.png'
import projects from '../../../assets/images/projects.png'

const Landing = () => {
  const [heroStep, setHeroStep] = useState(0)

  useEffect(() => {
    // Animation sequence: Track -> Optimize -> Achieve -> Logo
    const steps = [0, 1, 2, 3]
    let idx = 0
    const interval = setInterval(() => {
      setHeroStep(steps[idx])
      idx++
      if (idx > steps.length - 1) clearInterval(interval)
    }, 900)
    return () => clearInterval(interval)
  }, [])

  const demoScreens = [
    {
      img: timesheet,
      alt: 'Timesheet Screenshot',
      desc: 'Log, edit, and manage work hours by date, project, and employee. Bulk actions make management fast and easy.',
      label: 'Timesheet',
    },
    {
      img: report,
      alt: 'Reports Screensho',
      desc: 'Generate and export detailed reports by name, project, date range, or shift type. Toggle views and print with ease.',
      label: 'Reports',
    },
    {
      img: projects,
      alt: 'Projects Screenshot',
      desc: 'Manage projects, assign clients, and organize your team. Add, edit, or delete with just a few clicks.',
      label: 'Projects & Team',
    },
  ]

  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* Header */}
      <header
        className="w-100 px-4 d-flex align-items-center justify-content-between position-absolute"
        style={{
          top: 0,
          left: 0,
          height: 72,
          background: 'transparent',
          zIndex: 100,
          width: '100%',
          pointerEvents: 'none',
        }}
      >
        <div className="d-flex align-items-center gap-2" style={{ pointerEvents: 'auto' }}></div>
        <nav className="d-flex gap-4" style={{ pointerEvents: 'auto' }}>
          <a href="#about" className="text-dark text-decoration-none fw-semibold">
            About
          </a>
          <a href="#features" className="text-dark text-decoration-none fw-semibold">
            Features
          </a>
          <a href="#demo" className="text-dark text-decoration-none fw-semibold">
            Demo
          </a>
          {/* <a href="#contact" className="text-dark text-decoration-none fw-semibold">
            Contact
          </a> */}
        </nav>
      </header>

      {/* Hero Section with BG Image, Blur, and Gradient Overlay */}
      <div
        className="d-flex flex-column align-items-center justify-content-center position-relative"
        style={{
          minHeight: '100vh',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Blurred BG image */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `url(${bg}) center center / cover no-repeat`,
            filter: 'grayscale(80%)',
            zIndex: 0,
          }}
        />
        {/* Gradient overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, #fff 0%, rgba(255, 255, 255, 0.82) 100%, rgba(255,255,255,0.1) 100%)',
            zIndex: 1,
          }}
        />
        {/* Animated Hero Text and Logo */}
        <div
          style={{
            zIndex: 2,
            minHeight: 160,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            className={`hero-anim-text ${heroStep === 0 ? 'show' : ''}`}
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: '#999999',
              opacity: heroStep === 0 ? 1 : 0,
              transition: 'opacity 0.5s',
            }}
          >
            TRACK
          </span>
          <span
            className={`hero-anim-text ${heroStep === 1 ? 'show' : ''}`}
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: '#999999',
              opacity: heroStep === 1 ? 1 : 0,
              transition: 'opacity 0.5s',
            }}
          >
            OPTIMIZE
          </span>
          <span
            className={`hero-anim-text ${heroStep === 2 ? 'show' : ''}`}
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: '#999999',
              opacity: heroStep === 2 ? 1 : 0,
              transition: 'opacity 0.5s',
            }}
          >
            ACHIEVE
          </span>
          <img
            src={logo}
            alt="UClock Logo"
            className={`hero-anim-logo ${heroStep === 3 ? 'show' : ''}`}
            style={{
              width: '65vh',
              height: 120,
              opacity: heroStep === 3 ? 1 : 0,
              transition: 'opacity 0.7s',
              marginTop: heroStep === 3 ? 16 : 0,
            }}
          />
        </div>
        <CButton
          style={{ zIndex: 2, border: '1px solid #000' }}
          href="/login"
          className="text-dark text-decoration-none fw-semibold"
        >
          Login
        </CButton>
      </div>

      {/* About Product Section */}
      <section id="about" className="py-5 bg-white">
        <CContainer>
          <CRow className="align-items-center">
            <CCol md={6}>
              <img src={logo} alt="About UClock" style={{ width: 120, height: 120 }} />
              <p className="text-muted">
                A comprehensive time tracking and workforce management platform designed for modern
                teams and businesses. Effortlessly log work hours, manage projects, organize teams,
                and generate insightful reports—all in one intuitive interface. UClock streamlines
                your daily operations, boosts productivity, and empowers you to make data-driven
                decisions with ease.
              </p>
            </CCol>
          </CRow>
        </CContainer>
      </section>

      {/* Features Section */}
      <section id="features" className="py-5 bg-light">
        <CContainer>
          <h3 className="fw-bold mb-4 text-center">Features</h3>
          <CRow className="g-4">
            <CCol md={4}>
              <div className="p-4 bg-white rounded shadow-sm h-100 text-center">
                <h5 className="text-dark text-decoration-none fw-semibold">Smart Timesheets</h5>
                <p className="text-muted">
                  Track work hours by date, project, and employee. Add, edit, or delete entries
                  individually or in bulk for seamless time management.
                </p>
              </div>
            </CCol>
            <CCol md={4}>
              <div className="p-4 bg-white rounded shadow-sm h-100 text-center">
                <h5 className="text-dark text-decoration-none fw-semibold">
                  Comprehensive Reports
                </h5>
                <p className="text-muted">
                  Generate detailed reports by name, project, date range, or shift type. Export to
                  CSV, print, and toggle between multiple views for flexible analysis.
                </p>
              </div>
            </CCol>
            <CCol md={4}>
              <div className="p-4 bg-white rounded shadow-sm h-100 text-center">
                <h5 className="text-dark text-decoration-none fw-semibold">
                  Project & Team Management
                </h5>
                <p className="text-muted">
                  Easily manage projects, clients, and teams. Add, edit, or delete projects and
                  employees, assign roles, and keep your organization structured and efficient.
                </p>
              </div>
            </CCol>
            <CCol md={4}>
              <div className="p-4 bg-white rounded shadow-sm h-100 text-center mt-4">
                <h5 className="text-dark text-decoration-none fw-semibold">Client Directory</h5>
                <p className="text-muted">
                  Maintain a searchable client list for quick access and streamlined project
                  assignments.
                </p>
              </div>
            </CCol>
            <CCol md={4}>
              <div className="p-4 bg-white rounded shadow-sm h-100 text-center mt-4">
                <h5 className="text-dark text-decoration-none fw-semibold">Bulk Actions</h5>
                <p className="text-muted">
                  Save time with bulk delete and edit options for timesheets and team management.
                </p>
              </div>
            </CCol>
            <CCol md={4}>
              <div className="p-4 bg-white rounded shadow-sm h-100 text-center mt-4">
                <h5 className="text-dark text-decoration-none fw-semibold">
                  User-Friendly Interface
                </h5>
                <p className="text-muted">
                  Enjoy a clean, intuitive dashboard that makes workforce management simple for
                  everyone.
                </p>
              </div>
            </CCol>
          </CRow>
        </CContainer>
      </section>

      {/* Demo Section */}
      <section id="demo" className="bg-white border-top">
        <div
          className="d-flex flex-column align-items-center justify-content-center position-relative"
          style={{
            minHeight: '100vh',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Blurred BG image */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `url(${bg}) center center / cover no-repeat`,
              filter: 'grayscale(80%)',
              zIndex: 0,
            }}
          />
          {/* Gradient overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to bottom, #fff 0%, rgba(255, 255, 255, 0.82) 100%, rgba(255,255,255,0.1) 100%)',
              zIndex: 1,
            }}
          />
          <h5 className="text-dark text-decoration-none fw-semibold" style={{ zIndex: 2 }}>
            Demo
          </h5>
          <p className="text-center text-muted mb-5" style={{ zIndex: 2 }}>
            Explore UClock in action. Swipe through the screenshots to see key features and
            workflows.
          </p>
          <div className="d-flex justify-content-center" style={{ zIndex: 2 }}>
            <div style={{ width: '70%' }}>
              <CCarousel controls>
                {demoScreens.map((screen, idx) => (
                  <CCarouselItem key={idx}>
                    <div className="d-flex flex-column align-items-center">
                      <img
                        src={screen.img}
                        alt={screen.alt}
                        className="img-fluid"
                        style={{
                          width: '100%',
                          // maxWidth: 500,
                          borderRadius: 24,
                          // boxShadow: '0px 0px 400px 5px rgba(0,0,0,0.75)',
                          background: '#f8f9fa',
                          border: '5px solid rgba(70, 70, 70, 0.22)',
                          display: 'block',
                        }}
                      />
                      <div className="text-center mt-3 text-muted small">
                        <strong>{screen.label}:</strong> {screen.desc}
                      </div>
                    </div>
                  </CCarouselItem>
                ))}
              </CCarousel>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="w-100 py-3 px-4 bg-white border-top text-center text-muted">
        <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-3 mb-2">
          <a href="#about" className="text-dark text-decoration-none fw-semibold">
            About
          </a>
          <span className="d-none d-md-inline">|</span>
          <a href="#features" className="text-dark text-decoration-none fw-semibold">
            Features
          </a>
          <span className="d-none d-md-inline">|</span>
          <a href="#demo" className="text-dark text-decoration-none fw-semibold">
            Demo
          </a>
          {/* <span className="d-none d-md-inline">|</span>
          <a href="#contact" className="text-dark text-decoration-none fw-semibold">Contact</a> */}
        </div>
        <div>&copy; {new Date().getFullYear()} UClock. All rights reserved.</div>
      </footer>
    </div>
  )
}

export default Landing
