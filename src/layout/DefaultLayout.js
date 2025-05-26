import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppSidebar, AppHeader } from '../components/index'
import { useSelector } from 'react-redux'
import { CContainer } from '@coreui/react'

const DefaultLayout = ({ children }) => {
  const navigate = useNavigate()
  const token = useSelector((state) => state.auth.token)
  useEffect(() => {
    // write an api to vlidate token _ if validated then route to page
    if (!token) {
      navigate('/') // Redirect to login if not authenticated
    }
  }, [token, navigate])

  return token ? (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <div className="body flex-grow-1">
          <CContainer className="px-4" style={{width:"auto", maxWidth:"fit-content", minWidth:"100%"}}>
              {children}
            </CContainer>
          </div>
        </div>
      </div>
    </div>
  ) : null
}

export default DefaultLayout
