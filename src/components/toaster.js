import React, { createContext, useContext, useRef, useState } from 'react';
import { CToast, CToastBody, CToastClose, CToaster } from '@coreui/react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const toaster = useRef();

  const showToast = (message, options = {}) => {
    const toast = (
      <CToast
        autohide={options.autohide ?? true}
        color={options.color ?? 'primary'}
        className="text-white align-items-center"
        visible={true}
      >
        <div className="d-flex">
          <CToastBody>{message}</CToastBody>
          <CToastClose className="me-2 m-auto" />
        </div>
      </CToast>
    );
    setToasts((prevToasts) => [
      ...prevToasts,
      { key: Date.now(), element: toast },
    ]);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <CToaster ref={toaster} placement="top-end" style={{padding:20}}>
        {toasts.map(({ key, element }) => React.cloneElement(element, { key }))}
      </CToaster>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  return useContext(ToastContext);
};
