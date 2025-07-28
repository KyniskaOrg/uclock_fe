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
  setEmployeePosition,
} from '../../../apis/employeeApis'
import { useToast } from '../../../components/toaster'
import CIcon from '@coreui/icons-react'
import { cilTrash, cilPen } from '@coreui/icons'
import EditebleCell from '../../../components/EditableField'
import DeleteModal from '../../../components/DeleteModal'

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

const EditEmployeeModal = ({ visible, setVisible, employeeData, fetchEmployees }) => {
  const { showToast } = useToast()
  const [name, setName] = useState(employeeData?.name || '')
  const [email, setEmail] = useState(employeeData?.email || '')
  const [phone, setPhone] = useState(employeeData?.phone || '')
  const [isSupervisor, setIsSupervisor] = useState(employeeData?.position === 'supervisor')

  useEffect(() => {
    setName(employeeData?.name || '')
    setEmail(employeeData?.email || '')
    setPhone(employeeData?.phone || '')
    setIsSupervisor(employeeData?.position === 'supervisor')
  }, [employeeData, visible])

  const handleEditEmployee = async (event) => {
    event.preventDefault()
    try {
      await editEmployee({
        employee_id: employeeData.employee_id,
        name,
        email,
        phone,
        position: isSupervisor ? 'supervisor' : '',
      })
      showToast('Employee updated successfully', { color: 'success' })
      setVisible(false)
      fetchEmployees()
    } catch (error) {
      showToast('Failed to update employee', { color: 'danger' })
    }
  }

  return (
    <CModal alignment="center" scrollable visible={visible} onClose={() => setVisible(false)}>
      <CForm onSubmit={handleEditEmployee}>
        <CModalHeader>
          <CModalTitle>Edit Employee</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol>
              <CFormInput
                id="employeeName"
                placeholder="Employee Name"
                minLength={3}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mb-2"
              />
              <CFormInput
                id="employeeEmail"
                placeholder="Employee Email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-2"
              />
              <CFormInput
                id="employeePhone"
                placeholder="Employee Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mb-2"
              />
              <CFormCheck
                label="Supervisor"
                checked={isSupervisor}
                onChange={(e) => setIsSupervisor(e.target.checked)}
              />
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" type="submit">
            Save Changes
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
  const [editVisible, setEditVisible] = useState(false) // For edit modal visibility
  const [employeeData, setEmployeeData] = useState({}) // For storing employee data to be edited
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedEditEmployee, setSelectedEditEmployee] = useState({})

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

  const handleSelectAllEmployees = (isSelected, employees) => {
    if (isSelected) {
      // Add all employees to the selected list
      setSelectedEmployees(employees)
    } else {
      // Clear the selected employees list
      setSelectedEmployees([])
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

  const setSupervisor = async (row) => {
    try {
      await setEmployeePosition({
        employee_id: row.employee_id,
        position: row.position === 'supervisor' ? '' : 'supervisor',
      })
      showToast('Selected employees set as supervisor', { color: 'success' })
      // setShowDeleteModal(false)

      fetchEmployees()
    } catch (error) {
      showToast('Error setting supervisor', { color: 'danger' })
    }
  }

  const openEditModal = (row) => {
    setSelectedEditEmployee(row)
    setShowEditModal(true)
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
            style={{ cursor: 'pointer' }}
            checked={selectedEmployees.some((emp) => emp.employee_id === row.employee_id)}
            onChange={(e) => handleSelectEmployee(row, e.target.checked)}
          />
        ),
        selectAll: (data) => (
          <CFormCheck
            id="select-all_emp"
            style={{ cursor: 'pointer' }}
            checked={selectedEmployees.length === data.length && data.length > 0}
            onChange={(e) => handleSelectAllEmployees(e.target.checked, data)}
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
        name: 'Employee Phone', // Column name
        sortBy: 'phone', // Default sort by name
        allowsorting: false, // Sorting allowed
        // customComponent: (row) => (
        //   <EditebleCell
        //     value={row.phone}
        //     onEnter={(val) => editEmployeeName({ value: val, data: row })}
        //   />
        // ),
      },
      col6: {
        name: 'Supervisor', // Column name
        sortBy: 'position', // Default sort by client name
        allowsorting: true, // Sorting allowed
        width: '15px',
        customComponent: (row) => (
          <CFormCheck
            id={`select-${row.employee_id}`}
            style={{ cursor: 'pointer' }}
            checked={row.position === 'supervisor'}
            onChange={() => setSupervisor(row)}
          />
        ),
      },
      col7: {
        name: 'Action',
        sortBy: '',
        width: '15px',
        customComponent: (row) => (
          <CCol className="d-flex justify-content-end">
            <CIcon
              icon={cilPen}
              size="s"
              style={{ opacity: 0.5, cursor: 'pointer', margin: 5 }}
              onClick={() => openEditModal(row)}
            />
            <CIcon
              icon={cilTrash}
              size="s"
              style={{ opacity: 0.5, cursor: 'pointer', margin: 5 }}
              onClick={() => openDeleteModal(row)}
            />
          </CCol>
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
          phone: element.phone, // Corresponds to col3
          position: element.position, // Corresponds to col4
        })
      })
      console.log(data)
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
          <EditEmployeeModal
            visible={showEditModal}
            setVisible={setShowEditModal}
            employeeData={selectedEditEmployee}
            fetchEmployees={fetchEmployees}
          />
          <DeleteModal
            visible={showDeleteModal}
            setVisible={setShowDeleteModal}
            selected={
              selectedEmployees.length > 1
                ? selectedEmployees.map((item) => item.employee_id)
                : [selectedEmployee.employee_id]
            }
            showToast={showToast}
            triggerDelete={selectedEmployees.length > 1 ? triggerDeleteSelected : triggerDelete}
            title={'Delete Employee'}
            name={selectedEmployee.name || ''}
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
                      style={{ cursor: 'pointer' }}
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
