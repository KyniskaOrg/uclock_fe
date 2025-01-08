import React, { useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilMenu } from '@coreui/icons'

import { AppHeaderDropdown } from './header/index'

// Import the setSidebarShow action from uiSlice
import { setSidebarShow } from '../redux/reducers/uiReducer'

const AppHeader = () => {
  const headerRef = useRef()
  const dispatch = useDispatch()

  // Access the sidebarShow state from the ui slice
  const sidebarShow = useSelector((state) => state.ui.sidebarShow)

  const handleSidebarToggle = () => {
    dispatch(setSidebarShow(!sidebarShow)) // Dispatch action to toggle the sidebar visibility
  }

  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler
          onClick={handleSidebarToggle} // Toggle the sidebar when clicked
          style={{ marginInlineStart: '-14px' }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderNav>
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
