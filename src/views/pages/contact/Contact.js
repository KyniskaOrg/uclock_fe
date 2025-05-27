import { useState } from 'react'
import {
  CFormInput,
  CFormTextarea,
  CAlert,
  CContainer,
  CRow,
  CCol,
  CButton,
} from '@coreui/react'
import bg from '../../../assets/images/bg.jpg'
import mob2left from '../../../assets/images/mob2-left.png'
import logo from '../../../assets/images/logo.svg'

const Contact = () => {
  const [submitted, setSubmitted] = useState(false)

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
          <a href="/">
            <img src={logo} alt="About UClock" style={{ width: 120, height: 120 }} />
          </a>
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
        {/* Contact Form and Image Side by Side */}
        <CContainer
          className="py-5"
          style={{
            zIndex: 2,
            minHeight: 160,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CRow className="justify-content-center align-items-center w-100">
            <CCol md={6} className="mb-5 mb-md-0">
              <h2 className="mb-4 fw-bold text-center text-md-start">Contact Us</h2>
              {submitted && (
                <CAlert color="success" onClose={() => setSubmitted(false)} dismissible>
                  Thank you for reaching out! We will get back to you soon.
                </CAlert>
              )}
              <form
                action="https://formsubmit.co/ahmed@kyniska.eu"
                method="POST"
                onSubmit={() => setSubmitted(true)}
              >
                <input type="hidden" name="_captcha" value="false" />
                <CFormInput
                  className="mb-3"
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  required
                />
                <CFormInput
                  className="mb-3"
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  required
                />
                <CFormTextarea
                  className="mb-3"
                  name="message"
                  placeholder="Your Message"
                  rows={5}
                  required
                />
                <div className="d-grid">
                  <CButton color="primary" type="submit">
                    Send Message
                  </CButton>
                </div>
              </form>
            </CCol>
            <CCol md={6} className="d-flex justify-content-center">
              <img
                src={mob2left}
                alt="Contact Illustration"
                style={{
                  maxWidth: 380,
                  width: '100%',
                  display: 'block',
                }}
              />
            </CCol>
          </CRow>
        </CContainer>
      </div>
      {/* Footer */}
      <footer className="w-100 py-3 px-4 bg-white border-top text-center text-muted">
        <div>&copy; {new Date().getFullYear()} UClock. All rights reserved.</div>
      </footer>
    </div>
  )
}

export default Contact
