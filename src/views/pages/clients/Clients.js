import { useState, useEffect } from 'react'
import CustomTable from '../../../components/table/table'
import {
  CButton,
  CCol,
  CRow,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CFormInput,
  CForm,
  CFormCheck,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilTrash } from '@coreui/icons'
import { createClient, editClient, getAllClients, deleteClients } from '../../../apis/clientApis'
import { useToast } from '../../../components/toaster'
import EditebleCell from '../../../components/EditableField'
import DeleteModal from '../../../components/DeleteModal'

const NewClientModal = ({ visible, setVisible, fetchClients }) => {
  const { showToast } = useToast()
  const [clientName, setClientName] = useState('')

  const handleCreateClient = async (event) => {
    event.preventDefault()
    try {
      const payload = {
        clientName,
      }
      await createClient(payload)
      showToast('Client added successfully', { color: 'success' })
      setVisible(false)
      setClientName('')
      fetchClients()
    } catch (error) {
      showToast('Failed to add client', { color: 'danger' })
    }
  }

  return (
    <CModal alignment="center" scrollable visible={visible} onClose={() => setVisible(false)}>
      <CForm onSubmit={handleCreateClient}>
        <CModalHeader>
          <CModalTitle>Add New client</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol>
              <CFormInput
                id="clientName"
                placeholder="Client Name"
                value={clientName}
                minLength={3}
                required
                onChange={(e) => setClientName(e.target.value)}
              />
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" type="submit">
            Create Client
          </CButton>
        </CModalFooter>
      </CForm>
    </CModal>
  )
}

const Clients = () => {
  const { showToast } = useToast()
  const [visible, setVisible] = useState(false) // For modal visibility
  const [data, setData] = useState([]) // Storing the structured data for columns
  const [loading, setLoading] = useState(false) // To track if data is being fetched
  const [totalCount, setTotalCount] = useState(0) // To track if data is being fetched
  const [filter, setFilter] = useState({
    searchText: '', // Filter by Client name
    sortBy: null, // Sort by name (default)
    sortOrder: null, // Sort order (ASC or DESC)
    page: 1, // Current page for pagination
    limit: 10, // Current limit for pagination
  })
  const [showDeleteModal, setShowDeleteModal] = useState(false) // For modal visibility
  const [selectedClients, setSelectedClients] = useState([])
  const [selectedClient, setSelectedClient] = useState([])

  //       col1: {
  //         name: 'Select', // Column name
  //         sortBy: 'employee_id', // Default sort by client name
  //         allowsorting: false,
  //         width: '20px',
  //         customComponent: (row) => (
  //           <CFormCheck
  //             id={`select-${row.employee_id}`}
  //             style={{ cursor: 'pointer' }}
  //             checked={selectedClients.some((emp) => emp.employee_id === row.employee_id)}
  //             onChange={(e) => handleSelectEmployee(row, e.target.checked)}
  //           />
  //         ),
  //         selectAll: (data) => (
  //           <CFormCheck
  //             id="select-all_emp"
  //             style={{ cursor: 'pointer' }}
  //             checked={selectedClients.length === data.length && data.length > 0}
  //             onChange={(e) => handleSelectAllEmployees(e.target.checked, data)}
  //           />
  //         ),
  //       },
  //       col2: {
  //         name: 'Employee ID', // Column name
  //         sortBy: 'employee_id', // Default sort by client name
  //         allowsorting: false,
  //         width: '100px',
  //       },

  const editClientName = async (data) => {
    try {
      const payload = {
        clientName: data.value,
        client_id: data.data.client_id,
      }
      if (data.value && data.data.client_id) {
        await editClient(payload)
        showToast('client updated successfully', { color: 'success' })
      } else {
        throw new Error()
      }
    } catch (error) {
      showToast('error updating', { color: 'danger' })
    }
  }

  const handleSelectAllClients = (isSelected, clients) => {
    if (isSelected) {
      // Add all clients to the selected list
      setSelectedClients(clients)
    } else {
      // Clear the selected clients list
      setSelectedClients([])
    }
  }

  const handleSelectClients = (clients, isSelected) => {
    setSelectedClients((prev) =>
      isSelected
        ? [...prev, clients]
        : prev.filter((selected) => selected.client_id !== clients.client_id),
    )
  }

  const openDeleteSelectedModal = () => {
    setShowDeleteModal(true)
    setSelectedClient({ client_ids: selectedClients.map((item) => item.client_id) })
  }
  const openDeleteModal = async (data) => {
    setShowDeleteModal(true)
    setSelectedClient(data)
  }

  const triggerDelete = async () => {
    try {
      await deleteClients({ client_ids: [selectedClient.client_id] })
      showToast('Client deleted successfully', { color: 'success' })
      setShowDeleteModal(false)
      fetchClients()
    } catch (error) {
      showToast('Error deleting', { color: 'danger' })
    }
  }

  const triggerDeleteSelected = async () => {
    try {
      await deleteClients({ client_ids: selectedClients.map((item) => item.client_id) })
      showToast('Selected clients deleted successfully', { color: 'success' })
      setShowDeleteModal(false)
      setSelectedClients([]) // Clear selected clients
      fetchClients()
    } catch (error) {
      showToast('Error deleting selected clients', { color: 'danger' })
    }
  }
  // Function to fetch all Clients with applied filters
  const structuredData = {
    columns: {
      col1: {
        name: 'Select', // Column name
        sortBy: 'employee_id', // Default sort by client name
        allowsorting: false,
        width: '20px',
        customComponent: (row) => (
          <CFormCheck
            id={`select-${row.employee_id}`}
            style={{ cursor: 'pointer' }}
            checked={selectedClients.some((emp) => emp.client_id === row.client_id)}
            onChange={(e) => handleSelectClients(row, e.target.checked)}
          />
        ),
        selectAll: (data) => (
          <CFormCheck
            id="select-all_emp"
            style={{ cursor: 'pointer' }}
            checked={selectedClients.length === data.length && data.length > 0}
            onChange={(e) => handleSelectAllClients(e.target.checked, data)}
          />
        ),
      },
      col2: {
        name: 'Client Name', // Column name
        sortBy: 'name', // Default sort by name
        allowsorting: true, // Sorting allowed
        customComponent: (row) => (
          <EditebleCell
            value={row.name}
            key={'asds'}
            onEnter={(val) => editClientName({ value: val, data: row })}
          />
        ),
      },
      col3: {
        name: 'Client id', // Column name
        sortBy: 'client_id', // Default sort by client name
        allowsorting: false,
      },
      col4: {
        name: 'Action', // Column name
        sortBy: '', // Default sort by client name
        width: '15px',
        customComponent: (row) => (
          <CIcon
            icon={cilTrash}
            size="s"
            style={{ opacity: 0.5, cursor: 'pointer', marginLeft: 12 }}
            onClick={() => openDeleteModal(row)}
          />
        ),
      },
    },
    setFilter: setFilter,
    filter: filter,
    searchableTable: true,
    totalLength: totalCount,
    data: data,
  }
  const fetchClients = async () => {
    setLoading(true)
    try {
      const response = await getAllClients(filter)
      let data = []
      response.clients.forEach((element) => {
        data.push({
          name: element.name, // Corresponds to col1
          client_id: element.client_id, // Corresponds to col2
        })
      })
      setTotalCount(response.totalClients)
      // Add more columns as needed
      setData(data)
    } catch (error) {
      console.error('Error fetching Clients:', error)
    } finally {
      setLoading(false)
    }
  }

  // Trigger the initial fetch when the component mounts or when the filter changes
  useEffect(() => {
    fetchClients()
  }, [filter]) // Re-fetch when the filter changes

  return (
    <>
      <CRow className="align-items-center mb-3">
        <CCol xs={5} xl={2}>
          <h3>Clients</h3>
        </CCol>
        <DeleteModal
          visible={showDeleteModal}
          setVisible={setShowDeleteModal}
          selected={
            selectedClients.length > 1
              ? selectedClients.map((item) => item.client_id)
              : [selectedClient.client_id]
          }
          showToast={showToast}
          triggerDelete={selectedClients.length > 1 ? triggerDeleteSelected : triggerDelete}
          title={'Delete Employee'}
          name={selectedClients.name || ''}
        />
        <CCol className="flex-row-end">
          <NewClientModal visible={visible} setVisible={setVisible} fetchClients={fetchClients} />
          <CButton color={'primary'} onClick={() => setVisible(true)}>
            Add new client
          </CButton>
          {selectedClients.length > 0 && (
            <CButton color={'danger'} onClick={openDeleteSelectedModal} style={{ marginRight: 10 }}>
              Delete Selected
            </CButton>
          )}
        </CCol>
      </CRow>
      <CustomTable structuredData={structuredData} loading={loading} />
    </>
  )
}

export default Clients
