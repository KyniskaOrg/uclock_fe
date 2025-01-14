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
  CForm,
} from '@coreui/react'
import { createEmployee, getAllEmployees } from '../../../apis/employeeApis'
import { useToast } from '../../../components/toaster'

const NewEmployeeModal = ({ visible, setVisible, fetchEmployees }) => {
  const { showToast } = useToast()
  const [employeeName, setEmployeeName] = useState('')

  const handleCreateEmployee = async (event) => {
    event.preventDefault()
    try {
      const payload = {
        name: employeeName,
      }
      await createEmployee(payload)
      showToast('Employee added successfully', { color: 'success' })
      setVisible(false)
      setEmployeeName('')
      fetchEmployees()
    } catch (error) {
      showToast('Failed to add employee', { color: 'danger' })
    }
  }

  return (
    <CModal alignment="center" scrollable visible={visible} onClose={() => setVisible(false)}>
      <CForm onSubmit={handleCreateEmployee}>
        <CModalHeader>
          <CModalTitle>Add New Employee</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol>
              <CFormInput
                id="clientName"
                placeholder="Employee Name"
                value={employeeName}
                minLength={3}
                required
                onChange={(e) => setEmployeeName(e.target.value)}
              />
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" type="submit">
            Create Employee
          </CButton>
        </CModalFooter>
      </CForm>
    </CModal>
  )
}

const Employee = () => {
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

  // Function to fetch all Employees with applied filters
  const structuredData = {
    columns: {
      col1: {
        name: 'Employee ID', // Column name
        sortBy: 'employee_id', // Default sort by client name
        allowsorting: false,
      },
      col2: {
        name: 'Employee Name', // Column name
        sortBy: 'name', // Default sort by name
        allowsorting: true, // Sorting allowed
      },
      col3: {
        name: 'Employee Email', // Column name
        sortBy: 'email', // Default sort by client name
        allowsorting: false,
      },
    },
    setFilter: setFilter,
    filter: filter,
    searchableTable: true,
    totalLength: totalCount,
    data: data,
  }
  const fetchEmployees = async () => {
    setLoading(true)
    try {
      const response = await getAllEmployees(filter)
      let data = []
      response.employees.forEach((element) => {
        data.push({
          name: element.name, // Corresponds to col1
          employee_id: element.employee_id, // Corresponds to col2
          email: element.email, // Corresponds to col3
        })
      })
      setTotalCount(response.totalEmployees)
      // Add more columns as needed
      setData(data)
    } catch (error) {
      console.error('Error fetching Employees:', error)
    } finally {
      setLoading(false)
    }
  }

  // Trigger the initial fetch when the component mounts or when the filter changes
  useEffect(() => {
    fetchEmployees()
  }, [filter]) // Re-fetch when the filter changes

  return (
    <>
      <CRow className="align-items-center mb-3">
        <CCol xs={5} xl={2}>
          <h3>Teams</h3>
        </CCol>
        <CCol className="flex-row-end">
          <NewEmployeeModal visible={visible} setVisible={setVisible} fetchEmployees={fetchEmployees} />
          <CButton color={'primary'} onClick={() => setVisible(true)}>
            Add new Employee
          </CButton>
        </CCol>
      </CRow>
      <CustomTable structuredData={structuredData} loading={loading} />
    </>
  )
}

export default Employee
