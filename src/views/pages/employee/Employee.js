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
  CFormCheck,
} from '@coreui/react'
import {
  createEmployee,
  getAllEmployees,
  editEmployee,
  deleteEmployee,
} from '../../../apis/employeeApis'
import { useToast } from '../../../components/toaster'
import CIcon from '@coreui/icons-react'
import { cilTrash } from '@coreui/icons'

const EditebleCell = ({ value, key, onEnter }) => {
  const [cellVal, setCellVal] = useState(value)

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault() // Prevents form submission behavior
      onEnter(cellVal) // Call the provided function with the value
    }
  }

  return (
    <CFormInput
      className="form-control-table"
      key={key}
      value={cellVal}
      onChange={(e) => setCellVal(e.target.value)}
      onKeyDown={handleKeyDown} // Detect Enter key
    ></CFormInput>
  )
}

const NewEmployeeModal = ({ visible, setVisible, fetchEmployees }) => {
  const { showToast } = useToast()
  const [employeeName, setEmployeeName] = useState('')
  const [employeeEmail, setEmployeeEmail] = useState('')

  const handleCreateEmployee = async (event) => {
    event.preventDefault()
    try {
      const payload = {
        name: employeeName,
        email: employeeEmail,
      }
      await createEmployee(payload)
      showToast('Employee added successfully', { color: 'success' })
      setVisible(false)
      setEmployeeName('')
      fetchEmployees()
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add employee'
      showToast(errorMessage, { color: 'danger' })
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
                className="mb-3"
                onChange={(e) => setEmployeeName(e.target.value)}
              />
              <CFormInput
                id="clientEmail"
                placeholder="Employee Email"
                value={employeeEmail}
                minLength={3}
                type="email"
                required
                onChange={(e) => setEmployeeEmail(e.target.value)}
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

const DeleteEmployeeModal = ({ visible, setVisible, data, triggerDelete }) => {
  const { name, employee_id, employee_ids } = data

  return (
    <CModal alignment="center" scrollable visible={visible} onClose={() => setVisible(false)}>
      <CForm
        onSubmit={(e) => {
          e.preventDefault()
          triggerDelete(employee_ids || employee_id)
        }}
      >
        <CModalHeader>
          <CModalTitle>Delete Employee</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {employee_ids ? (
            <>
              Are you sure you want to delete the selected employees?
              <br />
              <div style={{ fontWeight: 'bold' }}>IDs: {employee_ids.join(', ')}</div>
              <br />
              If you delete, it will also delete all time entries with these.
            </>
          ) : (
            <>
              Are you sure you want to delete this employee?
              <br />
              <div style={{ fontWeight: 'bold' }}>
                Name: {name} id: {employee_id}
              </div>
              <br />
              If you delete, it will also delete all time entries with this.
            </>
          )}
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

const Employee = () => {
  const [visible, setVisible] = useState(false) // For modal visibility
  const [showDeleteModal, setShowDeleteModal] = useState(false) // For modal visibility
  const [selectedEmployee, setSelectedEmployee] = useState({}) // For modal visibility
  const [selectedEmployees, setSelectedEmployees] = useState([]) // For selected employee objects

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
  const { showToast } = useToast()

  const editEmployeeName = async (data) => {
    try {
      const payload = {
        name: data.value,
        employee_id: data.data.employee_id,
      }
      if (data.value && data.data.employee_id) {
        await editEmployee(payload)
        showToast('Employee updated successfully', { color: 'success' })
      } else {
        throw new Error()
      }
    } catch (error) {
      showToast('error updating', { color: 'danger' })
    }
  }

  const handleSelectEmployee = (employee, isSelected) => {
    setSelectedEmployees((prev) =>
      isSelected
        ? [...prev, employee]
        : prev.filter((selected) => selected.employee_id !== employee.employee_id),
    )
  }

  const removeSelectedEmployee = (employeeId) => {
    setSelectedEmployees((prev) => prev.filter((employee) => employee.employee_id !== employeeId))
  }

  const openDeleteModal = async (data) => {
    setShowDeleteModal(true)
    setSelectedEmployee(data)
  }

  const openDeleteSelectedModal = () => {
    setShowDeleteModal(true)
    setSelectedEmployee({ employee_ids: selectedEmployees.map((emp) => emp.employee_id) })
  }

  const triggerDelete = async (id) => {
    try {
      await deleteEmployee({ employee_ids: [id] })
      showToast('Employee deleted successfully', { color: 'success' })
      setShowDeleteModal(false)
      fetchEmployees()
    } catch (error) {
      showToast('Error deleting', { color: 'danger' })
    }
  }

  const triggerDeleteSelected = async () => {
    try {
      await deleteEmployee({ employee_ids: selectedEmployees.map((emp) => emp.employee_id) })
      showToast('Selected employees deleted successfully', { color: 'success' })
      setShowDeleteModal(false)
      setSelectedEmployees([]) // Clear selected employees
      fetchEmployees()
    } catch (error) {
      showToast('Error deleting selected employees', { color: 'danger' })
    }
  }

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
            checked={selectedEmployees.some((emp) => emp.employee_id === row.employee_id)}
            onChange={(e) => handleSelectEmployee(row, e.target.checked)}
          />
        ),
      },
      col2: {
        name: 'Employee ID', // Column name
        sortBy: 'employee_id', // Default sort by client name
        allowsorting: false,
        width: '100px',
      },
      col3: {
        name: 'Employee Name', // Column name
        sortBy: 'name', // Default sort by name
        allowsorting: true, // Sorting allowed
        customComponent: (row) => (
          <EditebleCell
            value={row.name}
            key={'asds'}
            onEnter={(val) => editEmployeeName({ value: val, data: row })}
          />
        ),
      },
      col4: {
        name: 'Employee Email', // Column name
        sortBy: 'email', // Default sort by client name
        allowsorting: false,
      },
      col5: {
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
      setData(data)
    } catch (error) {
      console.error('Error fetching Employees:', error)
    } finally {
      setLoading(false)
    }
  }

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
          <NewEmployeeModal
            visible={visible}
            setVisible={setVisible}
            fetchEmployees={fetchEmployees}
          />
          <DeleteEmployeeModal
            visible={showDeleteModal}
            setVisible={setShowDeleteModal}
            data={selectedEmployee}
            showToast={showToast}
            triggerDelete={selectedEmployees.length > 1 ? triggerDeleteSelected : triggerDelete}
          />

          <CButton color={'primary'} onClick={() => setVisible(true)}>
            Add new Employee
          </CButton>

          {selectedEmployees.length > 0 && (
            <CButton color={'danger'} onClick={openDeleteSelectedModal} style={{ marginRight: 10 }}>
              Delete Selected
            </CButton>
          )}
        </CCol>
      </CRow>
      <CustomTable structuredData={structuredData} loading={loading} slectableTable={false} />
      <CRow className="col-md-12">
        {/* Selected Employees Section */}
        {selectedEmployees.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h5>Selected Employees:</h5>
            <div
              style={{
                // Set a fixed height for the container
                overflowY: 'auto', // Enable vertical scrolling
              }}
            >
              <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', padding: 0, margin: 0 }}>
                {selectedEmployees.map((employee) => (
                  <li
                    key={employee.employee_id}
                    style={{
                      listStyle: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      background: '#f8f9fa',
                      padding: '5px 10px',
                      borderRadius: '5px',
                      border: '1px solid #ddd',
                    }}
                  >
                    <span style={{ marginRight: '10px', fontSize: 'small' }}>{employee.name}</span>
                    <div
                      color="danger"
                      size="sm"
                      onClick={() => removeSelectedEmployee(employee.employee_id)}
                    >
                      ✕
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CRow>
    </>
  )
}

export default Employee
