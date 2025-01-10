import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../redux/reducers/authReducer' // Import logout action
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CContainer,
} from '@coreui/react'
import { cilLockLocked, cilSettings, cilUser } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useToast } from '../../components/toaster'

const AppHeaderDropdown = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user) // Get user from Redux state
  const { showToast } = useToast()

  const handleLogout = () => {
    dispatch(logout())
    showToast('Logout Successful', { color: 'success' })
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        use avatar here
        {/* <CAvatar src={avatar8} size="md" /> */}
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CContainer className="col-md p-4 row justify-content-center" style={{ marginLeft: 0 }}>
          {/* Display user's name */}
          <div>{user ? user.username : 'User Name'}</div>
        </CContainer>
        <CDropdownDivider />
        <CDropdownItem href="#">
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilSettings} className="me-2" />
          Settings
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem onClick={handleLogout}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Log Out
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
