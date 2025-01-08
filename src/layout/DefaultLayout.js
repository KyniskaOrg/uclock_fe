import React from 'react'
import { AppSidebar, AppFooter, AppHeader } from '../components/index'

const DefaultLayout = ({children}) => {
  return (
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
  )
}

export default DefaultLayout
