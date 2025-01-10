import React from 'react'
import { CToast, CToastBody, CToastClose } from '@coreui/react'

 const CustomToast = (message) => {
  return (
    <CToast autohide={false} visible={true} className="align-items-center">
      <div className="d-flex">
        <CToastBody>{message}</CToastBody>
        <CToastClose className="me-2 m-auto" />
      </div>
    </CToast>
  )
}
export default CustomToast