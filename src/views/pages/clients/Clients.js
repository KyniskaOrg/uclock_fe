import React, { useState, useEffect } from 'react'
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
  CForm
} from '@coreui/react'
import { createClient, getAllClients } from '../../../apis/clientApis'
import { useToast } from '../../../components/toaster'

const NewClientModal = ({ visible, setVisible, fetchClients }) => {
  const { showToast } = useToast()
  const [clientName, setClientName] = useState('')

  const handleCreateClient = async (event) => {
    event.preventDefault()
    try {
      const payload = {
        clientName,
      }

      await createClient(payload).then(() => {
        showToast('Client added successfully', { color: 'success' })
        setVisible(false)
        setClientName('')
        fetchClients()
      }) // Call API
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
        <CButton color="primary" type='submit'>
          Create Client
        </CButton>
      </CModalFooter>
      </CForm>
    </CModal>
  )
}

const Clients = () => {
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

  // Function to fetch all Clients with applied filters
  const structuredData = {
    columns: {
      col1: {
        name: 'Client Name', // Column name
        sortBy: 'name', // Default sort by name
        allowsorting: true, // Sorting allowed
      },
      col2: {
        name: 'Client id', // Column name
        sortBy: 'client_id', // Default sort by client name
        allowsorting: false,
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
          client_id: element.client_id// Corresponds to col2
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
        <CCol className="flex-row-end">
          <NewClientModal visible={visible} setVisible={setVisible} fetchClients={fetchClients} />
          <CButton color={'primary'} onClick={() => setVisible(true)}>
            Add new client
          </CButton>
        </CCol>
      </CRow>
      <CustomTable structuredData={structuredData} loading={loading} />
    </>
  )
}

export default Clients
