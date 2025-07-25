import {
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CForm,
} from '@coreui/react'

const DeleteModal = ({ visible, setVisible, triggerDelete, title, selected }) => {
  return (
    <CModal alignment="center" scrollable visible={visible} onClose={() => setVisible(false)}>
      <CForm
        onSubmit={(e) => {
          e.preventDefault()
          triggerDelete(selected)
        }}
      >
        <CModalHeader>
          <CModalTitle>{title}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <>
            Are you sure you want to delete the selected item?
            <br />
            <div style={{ fontWeight: 'bold' }}>IDs: {selected.join(', ')}</div>
            <br />
            If you delete, it will also delete all time entries with these.
          </>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
          <CButton color="danger" type="submit">
            Delete
          </CButton>
        </CModalFooter>
      </CForm>
    </CModal>
  )
}
export default DeleteModal
