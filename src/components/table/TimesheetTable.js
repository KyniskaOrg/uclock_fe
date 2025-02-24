import React, { useEffect, useState } from 'react'
import { useToast } from '../../components/toaster'
import {
  getTimesheetRecord,
  setTimesheetRecord,
  deleteTimesheetRecords,
} from '../../apis/timesheetApis'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CTableFoot,
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CForm,
} from '@coreui/react'
import { v4 } from 'uuid'
import CIcon from '@coreui/icons-react'
import { cilX, cilMoon, cilSun } from '@coreui/icons'
import { AsyncPaginate } from 'react-select-async-paginate'
import { getAllProjects } from '../../apis/projectApis'
import { calculateTotaltime, calculateRowTotal } from '../../utils/utils'
import { CFormInput, CInputGroup, CInputGroupText } from '@coreui/react'

const ProjectDropdown = ({ value, onChange, rowData, setRowData, rowId }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(true) // Toggle for showing dropdown

  const loadOptions = async (search, prevOptions) => {
    if (isLoading) {
      return {
        options: prevOptions,
        hasMore: false,
      }
    }

    setIsLoading(true)
    try {
      let query = search ? { searchText: search } : { page: currentPage, limit: 50 }
      const data = await getAllProjects(query)

      const projects = data.projects
        .map((project) => ({
          value: project.project_id,
          label: project.name,
        }))
        // Filter out options already selected
        .filter((sel) => !rowData.some((project) => project.selectedProject === sel.value))

      const hasMore = currentPage < data.totalPages
      if (hasMore) {
        setCurrentPage(currentPage + 1)
      }

      setIsLoading(false)
      return {
        options: projects,
        hasMore,
      }
    } catch (error) {
      setIsLoading(false)
      console.error('Error loading projects:', error)
      return {
        options: [],
        hasMore: false,
      }
    }
  }

  const handleChange = (selectedOption) => {
    const updatedData = rowData.map((item) =>
      item.id === rowId ? { ...item, selectedProject: selectedOption.value } : item,
    )
    // console.log(updatedData)
    const hasNullSelectedProject = updatedData.some((item) => item.selectedProject === null)
    // console.log(hasNullSelectedProject)
    if (!hasNullSelectedProject) {
      const newRow = {
        id: v4(),
        selectedProject: null,
        monday: null,
        tuesday: null,
        wednesday: null,
        thursday: null,
        friday: null,
        saturday: null,
        sunday: null,
      }
      setRowData([...updatedData, newRow])
    } else {
      setRowData(updatedData)
    }
    onChange(selectedOption)
    setShowDropdown(false)
    setCurrentPage(1)
  }

  const customStyles = {
    // provide correct types here
    control: (provided) => ({
      ...provided,
      width: 250,
      borderRadius: 8,
      height: 40,
      cursor: 'pointer',
    }),
    option: (provided) => ({
      ...provided,
      cursor: 'pointer',
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: 200, // Limit dropdown height if needed
      overflowY: 'auto',
      scrollbarWidth: 'thin', // For Firefox
    }),
  }

  return (
    <div>
      {true ? (
        <AsyncPaginate
          styles={customStyles}
          options={[]} // Initial empty options list
          value={value.value ? value : null}
          loadOptions={loadOptions}
          onChange={(selectedOption) => handleChange(selectedOption)}
          isLoading={isLoading}
          debounceTimeout={500}
          menuPortalTarget={document.body} // To display over table
          placeholder="Search..."
          additional={{
            page: currentPage,
          }}
        />
      ) : (
        <div
          onClick={() => setShowDropdown(true)} // Show dropdown on click
          style={{ cursor: 'pointer', display: 'flex', flexDirection: 'row', padding: 10 }}
        >
          <div style={{ padding: '0 5px 0 5px', color: '#6f42c1' }}>●</div>{' '}
          {value ? value.label : 'Select a project'}
        </div>
      )}
    </div>
  )
}

const TimeInput = ({ value, onChange, disabeled, type }) => {
  const [time, setTime] = useState('')
  const [workType, setWorkType] = useState() // Stores raw user input
  const [formattedTime, setFormattedTime] = useState('') // Stores formatted time
  let totalMinutes = 0
  let hours = 0
  let minutes = 0
  let formatted = 0

  useEffect(() => {
    setTime(value)
    setFormattedTime(value)
  }, [value])
  useEffect(() => {
    setWorkType(type)
  }, [type])

  // Format the time when focus is lost (onBlur)
  const handleBlur = () => {
    if (time === '') {
      setFormattedTime('')
      return
    }

    // Check if input is already formatted like MM:SS
    if (/^\d+:\d+$/.test(time)) {
      const match = time.match(/^(\d+):(\d+)$/)
      if (match) {
        hours = match[1] // digits before the colon
        minutes = match[2] // digits after the colon
        hours = parseInt(hours, 10) // Remaining digits are hours
        minutes = minutes % 60
        hours = hours + Math.floor(match[2] / 60) // convert minutes and add

        const formatted = `${hours}:${minutes.toString().padStart(2, '0')}`
        setFormattedTime(formatted)
        setTime(formatted) // Reflect formatted time in the input
        onChange({ formatted, workType })
      } else {
        setFormattedTime('')
        setTime('')
      }
    } else {
      // Test for anything other than digits (0-9) and colons (:)
      if (/[^0-9]/.test(time)) {
        setFormattedTime('')
        setTime('')
      }
      // Remove non-numeric characters for raw numbers
      const numericInput = time.replace(/\D/g, '')

      if (numericInput.length < 3) {
        // If less than 3 digits, treat as minutes only
        totalMinutes = parseInt(numericInput, 10)
        hours = Math.floor(totalMinutes / 60)
        minutes = totalMinutes % 60
        formatted = `${hours}:${minutes.toString().padStart(2, '0')}`
        setFormattedTime(formatted)
        setTime(formatted) // Reflect formatted time in the input
        onChange({ formatted, workType })
      } else {
        // Convert input into proper MM:SS format
        hours = parseInt(numericInput.slice(0, -2), 10) // Remaining digits are hours
        minutes = numericInput.slice(-2) % 60
        hours = hours + Math.floor(numericInput.slice(-2) / 60) // convert seconds to minutes and add

        const formatted = `${hours}:${minutes.toString().padStart(2, '0')}`
        setFormattedTime(formatted)
        setTime(formatted) // Reflect formatted time in the input
        onChange({ formatted, workType })
      }
    }
  }
  const checkNight = () => {
    let type = workType === 'regular' ? 'night' : 'regular'
    if (formattedTime) {
      onChange({ formatted: formattedTime, workType: type })
    }
    setWorkType(type)
  }

  return (
    <CInputGroup>
      <CFormInput
        disabled={disabeled}
        className="custom-number-input"
        id="timeInput"
        type="text"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        onBlur={handleBlur}
      />
      {/* {console.log(workType)} */}
      <CInputGroupText style={{ backgroundColor: disabeled ? '#e7eaee' : 'white', paddingTop: 2 }}>
        <span>
          {workType === 'night' ? (
            <CIcon
              customClassName="nav-icon"
              icon={cilMoon}
              style={{
                width: '15px',
                height: '20px',
                cursor: 'pointer',
                color: '#999',
              }}
              onClick={() => checkNight()} // Toggle workType when clicked
            />
          ) : (
            <CIcon
              customClassName="nav-icon"
              icon={cilSun}
              style={{
                width: '15px',
                height: '20px',
                cursor: 'pointer',
                color: '#999',
              }}
              onClick={() => checkNight()} // Toggle workType when clicked
            />
          )}
        </span>
      </CInputGroupText>
    </CInputGroup>
  )
}

const DeleteRowModal = ({ visible, setVisible, confirmDeleteTimesheetRecords }) => {
  return (
    <CModal alignment="center" scrollable visible={visible} onClose={() => setVisible(false)}>
      <CForm
        onSubmit={(e) => {
          e.preventDefault()
          confirmDeleteTimesheetRecords()
        }}
      >
        <CModalHeader>
          <CModalTitle>Delete Row</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you sure you want to delete this row?
          <br />
          If you delete, it will also delete all time entries with this project/task for this week.
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

const RowContainer = ({ row, handleDelete, employeeId, dateRange, rowData, setRowData }) => {
  const [project, setProject] = useState({ value: null, label: '' })

  const cellStyle = {
    padding: '8px',
  }
  const { showToast } = useToast()
  // Fetch timesheet data for the current row
  const fetchTimesheetData = async (query) => {
    try {
      const data = await getTimesheetRecord(query)
      const updatedRow = { ...row }

      // Get the starting date (Monday) of the week from the `dateRange`
      const startDate = new Date(dateRange.startDate)

      // Define days of the week
      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

      // Populate the row data for each day
      days.forEach((day, index) => {
        // Calculate the date for the current day
        const currentDate = new Date(startDate)
        currentDate.setDate(startDate.getDate() + index)

        // Find matching timesheet data for the current date
        const dayData = data.find(
          (entry) =>
            new Date(entry.date).toISOString().split('T')[0] ===
            currentDate.toISOString().split('T')[0],
        )

        // Assign fetched data or null if no data is found for the day
        updatedRow[day] = dayData || {
          date: currentDate.toISOString().split('T')[0],
          hours_worked: '',
        }
      })

      // Update the row data in the parent state
      setRowData((prev) => prev.map((r) => (r.id === row.id ? updatedRow : r)))
    } catch (error) {
      console.error('Error fetching timesheet data:', error)
    }
  }

  const setTimesheetData = async (value, day, date, workType) => {
    try {
      const body = {
        employee_id: employeeId,
        project_id: project.value || row.selectedProject,
        date,
        hours_worked: value,
        work_type: workType || 'regular',
      }
      await setTimesheetRecord(body)
      //console.log('Updating timesheet:', body)
      showToast('successfully updated hour worked ', { color: 'success' })
      setRowData((prev) =>
        prev.map((r) => {
          if (r.id === row.id) {
            return { ...r, [day]: { ...r[day], hours_worked: value, date } }
          }
          return r
        }),
      )
    } catch (error) {
      showToast('Error updating timesheet data ', { color: 'danger' })
      console.error('Error updating timesheet data:', error)
    }
  }

  useEffect(() => {
    if (dateRange.startDate && employeeId && project.value) {
      const startDate = new Date(dateRange.startDate).toISOString().split('T')[0]
      fetchTimesheetData({
        employee_id: employeeId,
        project_id: project.value,
        start_date: startDate,
      })
    }
  }, [employeeId, dateRange, project.value])

  const rowTotal = calculateRowTotal(row)

  return (
    <CTableRow key={row.id} className="custom-shadow-hover">
      <CTableDataCell style={cellStyle}>
        <ProjectDropdown
          value={
            project.value
              ? project
              : {
                  value: row.selectedProject,
                  label: row.selectedProjectName,
                }
          }
          onChange={setProject}
          rowId={row.id}
          rowData={rowData}
          setRowData={setRowData}
        />
      </CTableDataCell>
      {['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map(
        (day, index) => {
          const currentDate = new Date(dateRange.startDate)
          currentDate.setDate(new Date(dateRange.startDate).getDate() + index)
          const dateStr = currentDate.toISOString().split('T')[0]

          return (
            <CTableDataCell style={cellStyle} key={day + employeeId + project.value}>
              <TimeInput
                type={row[day]?.work_type || 'regular'}
                disabeled={!(employeeId && (project.value || row.selectedProject))} // disabeled if project and employee is not selected
                day={day} // Pass the day name
                date={dateStr} // Pass the computed date
                value={row[day]?.hours_worked || ''}
                onChange={(value) =>
                  setTimesheetData(value.formatted, day, dateStr, value.workType)
                }
              />
            </CTableDataCell>
          )
        },
      )}
      <CTableDataCell style={{ ...cellStyle, padding: 15 }}>{rowTotal}</CTableDataCell>
      <CTableDataCell style={{ ...cellStyle, padding: 15 }}>
        <CIcon
          customClassName="nav-icon"
          icon={cilX}
          style={{
            width: '15px',
            height: '20px',
            cursor: 'pointer',
            color: '#999',
          }}
          onClick={() => handleDelete(row)}
        />
      </CTableDataCell>
    </CTableRow>
  )
}

const TimesheetTable = ({ employeeId, dateRange }) => {
  const { startDate } = dateRange
  const headerStyle = {
    padding: '8px',
    backgroundColor: 'rgba(37, 43, 54, 0.03)',
    fontWeight: 'normal',
    color: '#999',
    fontSize: '15px',
  }
  const { showToast } = useToast()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteRow, setDeleteRow] = useState(null)

  // Initial dummy data with new structure
  const [rowData, setRowData] = useState([
    {
      id: 1,
      selectedProject: null,
      monday: null,
      tuesday: null,
      wednesday: null,
      thursday: null,
      friday: null,
      saturday: null,
      sunday: null,
    },
  ])

  const confirmDeleteTimesheetRecords = async () => {
    try {
      const { row, timesheetIds } = deleteRow
      // Call the deleteTimesheetRecords API and wait for it to complete
      await deleteTimesheetRecords(timesheetIds)
      // Update the state to remove the row only after successful deletion
      setRowData((prev) => prev.filter((filterRow) => filterRow.id !== row.id))
      setShowDeleteModal(!showDeleteModal)
      showToast('row deleted successfully', { color: 'success' })
    } catch (error) {
      showToast('Error deleting row', { color: 'danger' })
      console.error('Error deleting timesheet records:', error)
    }
  }
  // Function to delete a row
  const handleDelete = (row) => {
    // sometimes rows are not deleting
    //  console.log(rowData)
    // Check if there are multiple rows in the data
    if (rowData.length <= 1) {
      console.warn('Cannot delete the last row.')
      return
    }

    // Extract all timesheet_id values from the row object
    const timesheetIds = Object.keys(row)
      .filter((key) => key !== 'id') // Exclude the 'id' field
      .map((day) => row[day]?.timesheet_id) // Map to timesheet_id
      .filter((id) => id !== undefined) // Remove undefined values

    //  console.log('Timesheet IDs to delete:', timesheetIds)

    // Ensure there are timesheet IDs to delete
    if (timesheetIds.length === 0) {
      console.warn('No timesheet records found to delete.')
      setRowData((prev) => prev.filter((filterRow) => filterRow.id !== row.id))
      return
    }

    // open download modal
    setDeleteRow({ row, timesheetIds })
    setShowDeleteModal(!showDeleteModal)
    //confirmDeleteTimesheetRecords(row,timesheetIds)
  }

  // Function to add a new row
  const handleAddRow = () => {
    const newRow = {
      id: v4(),
      selectedProject: null,
      selectedProjectName: '',
      monday: null,
      tuesday: null,
      wednesday: null,
      thursday: null,
      friday: null,
      saturday: null,
      sunday: null,
    }
    setRowData([...rowData, newRow])
  }

  let totals = calculateTotaltime(rowData)

  function calculateGrandTotal(totals) {
    // Convert "hours:minutes" to total minutes
    const timeToMinutes = (time) => {
      const [hours, minutes] = time.split(':').map(Number)
      return hours * 60 + minutes
    }

    // Convert total minutes back to "hours:minutes"
    const minutesToTime = (minutes) => {
      const hours = Math.floor(minutes / 60)
      const mins = minutes % 60
      return `${hours}:${mins.toString().padStart(2, '0')}`
    }

    // Sum all the times in the object
    let totalMinutes = 0
    for (const day in totals) {
      totalMinutes += timeToMinutes(totals[day])
    }

    // Return the total time in "hours:minutes" format
    return minutesToTime(totalMinutes)
  }

  const grandTotal = calculateGrandTotal(totals)

  // Helper function to get the day name and date
  const getDayLabel = (dayOffset) => {
    const today = new Date()
    const day = new Date(startDate ? startDate : today)
    day.setDate(day.getDate() + dayOffset)
    const options = { weekday: 'short', day: 'numeric', month: 'short' }
    return day.toLocaleDateString('en-US', options).replace(',', '')
  }

  const fetchTimesheetData = async (query) => {
    try {
      const data = await getTimesheetRecord(query)
      const newRows = []

      // Get the starting date (Monday) of the week from the `dateRange`
      const startDate = new Date(dateRange.startDate)

      // Define days of the week
      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

      // Group data by project
      const projectGroups = data.reduce((acc, entry) => {
        if (!acc[entry.project_id]) {
          acc[entry.project_id] = {
            id: entry.project_id,
            selectedProject: entry.project_id,
            selectedProjectName: entry.Project.name,
          }
        }

        const entryDate = new Date(entry.date).toISOString().split('T')[0]
        const dayIndex = (new Date(entryDate).getDay() + 6) % 7 // Adjust to start from Monday
        const dayName = days[dayIndex]

        acc[entry.project_id][dayName] = entry
        return acc
      }, {})

      // Create default empty objects for missing days
      Object.values(projectGroups).forEach((project) => {
        days.forEach((day, index) => {
          const currentDate = new Date(startDate)
          currentDate.setDate(startDate.getDate() + index)
          const dateString = currentDate.toISOString().split('T')[0]

          if (!project[day]) {
            project[day] = {
              date: dateString,
              hours_worked: '',
            }
          }
        })
        newRows.push(project)
      })

      // Update the state with the new rows
      setRowData([...newRows, newRows])
    } catch (error) {
      console.error('Error fetching timesheet data:', error)
    }
  }

  useEffect(() => {
    if (dateRange.startDate && employeeId) {
      const startDate = new Date(dateRange.startDate).toISOString().split('T')[0]
      fetchTimesheetData({
        employee_id: employeeId,
        project_id: null,
        start_date: startDate,
      })
    }
  }, [employeeId, dateRange])

  return (
    <>
      <DeleteRowModal
        visible={showDeleteModal}
        setVisible={setShowDeleteModal}
        confirmDeleteTimesheetRecords={confirmDeleteTimesheetRecords}
      />
      <CTable hover responsive style={{ border: '1px solid #ccc', minWidth: 1000 }}>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col" style={headerStyle}>
              Task
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" style={headerStyle}>
              {getDayLabel(0)}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" style={headerStyle}>
              {getDayLabel(1)}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" style={headerStyle}>
              {getDayLabel(2)}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" style={headerStyle}>
              {getDayLabel(3)}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" style={headerStyle}>
              {getDayLabel(4)}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" style={headerStyle}>
              {getDayLabel(5)}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" style={headerStyle}>
              {getDayLabel(6)}
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" style={headerStyle}>
              Total:
            </CTableHeaderCell>
            <CTableHeaderCell scope="col" style={headerStyle}>
              Actions
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {rowData.map((row) => (
            <RowContainer
              key={row.id}
              row={row}
              rowData={rowData}
              setRowData={setRowData}
              handleDelete={handleDelete}
              employeeId={employeeId}
              dateRange={dateRange}
            />
          ))}
        </CTableBody>
        <CTableFoot>
          <CTableRow>
            <CTableDataCell style={headerStyle}>Total:</CTableDataCell>
            <CTableDataCell style={headerStyle}>{totals.sunday}</CTableDataCell>
            <CTableDataCell style={headerStyle}>{totals.monday}</CTableDataCell>
            <CTableDataCell style={headerStyle}>{totals.tuesday}</CTableDataCell>
            <CTableDataCell style={headerStyle}>{totals.wednesday}</CTableDataCell>
            <CTableDataCell style={headerStyle}>{totals.thursday}</CTableDataCell>
            <CTableDataCell style={headerStyle}>{totals.friday}</CTableDataCell>
            <CTableDataCell style={headerStyle}>{totals.saturday}</CTableDataCell>
            <CTableDataCell style={headerStyle}>{grandTotal}</CTableDataCell>
            <CTableDataCell style={headerStyle}></CTableDataCell>
          </CTableRow>
        </CTableFoot>
      </CTable>
      <div style={{ padding: '10px' }}>
        <CButton color="primary" onClick={handleAddRow}>
          Add New Row
        </CButton>
      </div>
    </>
  )
}

export default TimesheetTable
