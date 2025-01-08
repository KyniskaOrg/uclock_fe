import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

// sidebar nav config
import navigation from '../_nav'

// Import the setSidebarShow action from uiSlice
import { setSidebarShow } from '../redux/reducers/uiReducer'

const AppSidebar = () => {
  const dispatch = useDispatch()

  // Access the sidebarShow state from the ui slice
  const sidebarShow = useSelector((state) => state.ui.sidebarShow)
  const unfoldable = useSelector((state) => state.ui.sidebarUnfoldable) // Adjust this if necessary, as you seem to be using the same state for unfoldable

  const handleSidebarVisibilityChange = (visible) => {
    dispatch(setSidebarShow(visible)) // Dispatch the action to update the sidebar visibility
  }

  return (
    <CSidebar
      className="border-end"
      colorScheme="light"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={handleSidebarVisibilityChange} // Use the dispatched action here
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/">
          place logo here
          {/* <CIcon customClassName="sidebar-brand-full" icon={logo} height={32} />
          <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={32} /> */}
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => handleSidebarVisibilityChange(false)} // Close the sidebar when clicked
        />
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => handleSidebarVisibilityChange(!sidebarShow)} // Toggle the sidebar visibility
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
