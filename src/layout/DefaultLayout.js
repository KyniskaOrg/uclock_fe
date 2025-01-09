import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppSidebar, AppFooter, AppHeader } from '../components/index'
import { useSelector } from 'react-redux'

const DefaultLayout = ({ children }) => {
  const navigate = useNavigate()
  const token = useSelector((state) => state.auth.token)
  useEffect(() => {
    // write an api to vlidate token _ if validated then route to page
    if (!token) {
      navigate('/login') // Redirect to login if not authenticated
    }
  }, [token, navigate])

  return token ? (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <div className="body flex-grow-1">{children}</div>
        </div>
        <AppFooter />
      </div>
    </div>
  ) : null
}

export default DefaultLayout
