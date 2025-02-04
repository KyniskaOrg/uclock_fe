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
import { AppSidebarNav } from './AppSidebarNav'

// sidebar nav config
import navigation from '../_nav'

// Import the setSidebarShow action from uiSlice
import { setSidebarShow } from '../redux/reducers/uiReducer'
import logo from "../assets/images/logo.svg"

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
      <CSidebarHeader className="border-bottom" style={{padding:"0"}}>
        <CSidebarBrand to="/">
          <img className="sidebar-brand-full" src={logo} />
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
