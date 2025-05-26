import React, { Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { CSpinner } from '@coreui/react'
import { useSelector } from 'react-redux'

import './scss/style.scss'
import logo from './assets/images/logo.svg'

// We use those styles to show code examples, you should remove them in your application.
import './scss/examples.scss'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Landing = React.lazy(() => import('./views/pages/landing/Landing'))
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))
const Projects = React.lazy(() => import('./views/pages/projects/Projects'))
const Clients = React.lazy(() => import('./views/pages/clients/Clients'))
const Employee = React.lazy(() => import('./views/pages/employee/Employee'))
const Timesheet = React.lazy(() => import('./views/pages/timesheets/Timesheets'))
const Reports = React.lazy(() => import('./views/pages/reports/reports'))
const DetaildReports = React.lazy(() => import('./views/pages/detailed_reports/DetailedReports'))
const WeeklyReports = React.lazy(() => import('./views/pages/weekly_reports/WeeklyReports'))

const App = () => {
  // Replace this with your actual auth logic

  const isLoggedIn = useSelector((state) => state.auth.token)

  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center loader" style={{ marginTop: '40vh' }}>
            <img style={{ height: 70 }} src={logo} />
          </div>
        }
      >
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <DefaultLayout>
                  <Timesheet />
                </DefaultLayout>
              ) : (
                <Landing />
              )
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/404" element={<Page404 />} />
          <Route path="/500" element={<Page500 />} />
          <Route
            path="/timesheet"
            element={
              <DefaultLayout>
                <Timesheet />
              </DefaultLayout>
            }
          />
          <Route
            path="/reports"
            element={
              <DefaultLayout>
                <WeeklyReports />
              </DefaultLayout>
            }
          />
          <Route
            path="/monthreports"
            element={
              <DefaultLayout>
                <DetaildReports />
              </DefaultLayout>
            }
          />
          <Route
            path="/projects"
            element={
              <DefaultLayout>
                <Projects />
              </DefaultLayout>
            }
          />
          <Route
            path="/teams"
            element={
              <DefaultLayout>
                <Employee />
              </DefaultLayout>
            }
          />
          <Route
            path="/clients"
            element={
              <DefaultLayout>
                <Clients />
              </DefaultLayout>
            }
          />
          <Route
            path="/yeet"
            element={
              <iframe
                style={{ width: '100%', height: '100vh' }}
                src="https://linktoahmad.github.io/"
              ></iframe>
            }
          />
          <Route
            path="*"
            element={
              <DefaultLayout>
                <Timesheet />
              </DefaultLayout>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
