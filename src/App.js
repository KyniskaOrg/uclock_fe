import React, { Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { CSpinner } from '@coreui/react'
import './scss/style.scss'

// We use those styles to show code examples, you should remove them in your application.
import './scss/examples.scss'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))
const Projects = React.lazy(() => import('./views/pages/projects/Projects'))
const Clients = React.lazy(() => import('./views/pages/clients/Clients'))
const Employee = React.lazy(() => import('./views/pages/employee/Employee'))

const App = () => {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          <Route exact path="/login" name="Login Page" element={<Login />} />
          <Route exact path="/register" name="Register Page" element={<Register />} />
          <Route exact path="/404" name="Page 404" element={<Page404 />} />
          <Route exact path="/500" name="Page 500" element={<Page500 />} />
          <Route path="*" name="Home" element={<DefaultLayout />} />
          <Route
            exact
            path="/timesheet"
            name="Timesheet"
            element={
              <DefaultLayout>
                <div>time</div>
              </DefaultLayout>
            }
          />
          <Route
            exact
            path="/reports"
            name="Reports"
            element={
              <DefaultLayout>
                <div>rep</div>
              </DefaultLayout>
            }
          />
          <Route
            exact
            path="/projects"
            name="Projects"
            element={
              <DefaultLayout>
                <Projects />
              </DefaultLayout>
            }
          />
          <Route
            exact
            path="/teams"
            name="Teams"
            element={
              <DefaultLayout>
                <Employee />
              </DefaultLayout>
            }
          />
          <Route
            exact
            path="/clients"
            name="Clients"
            element={
              <DefaultLayout>
                <Clients />
              </DefaultLayout>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
