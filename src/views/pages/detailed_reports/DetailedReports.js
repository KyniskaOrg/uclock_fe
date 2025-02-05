import React, { useState, useEffect } from 'react'
import { CCol, CRow, CCardHeader, CButton } from '@coreui/react'
import CustomTable from '../../../components/table/table'
import Calender from '../../../components/calender/calneder'
import EmployeeDropdown from '../../../components/EmployeeDropDown'
import ProjectDropdown from '../../../components/ProjectDropDown'
import { getTimesheetRecord, downloadTimesheetCsv } from '../../../apis/timesheetApis'
import { cilPrint } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const DetailedReports = () => {
  const [dateRange, setDateRange] = useState({ firstDay: null, lastDay: null })
  const [employees, setEmployees] = useState([]) // Array of selected employees
  const [projects, setProjects] = useState([]) // Array of selected projects
  const [loading, isLoading] = useState(false) // Array of selected projects

  const [filter, setFilter] = useState({
    searchText: '',
    sortBy: null,
    sortOrder: null,
    page: 1,
    limit: 10,
  })
  const [data, setData] = useState([]) // Data from API
  const [structuredData, setStructuredData] = useState({
    columns: {},
    setFilter: setFilter,
    filter: filter,
    searchableTable: false,
    totalLength: 0,
    data: [],
  })

  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: 'auto',
      maxWidth: 350,
      minWidth: 200,
    }),
  }

  // Helper function to calculate total time
  function calculateTotalTime(data) {
    let totalMinutes = 0

    for (const [date, time] of Object.entries(data)) {
      if (date === 'name' || date === 'projectName') continue // Skip the "name" key
      if (!time) continue
      const [hours, minutes] = time.split(':').map(Number)
      totalMinutes += hours * 60 + minutes
    }

    const totalHours = Math.floor(totalMinutes / 60)
    const remainingMinutes = totalMinutes % 60

    return `${totalHours}:${remainingMinutes.toString().padStart(2, '0')}`
  }

  // Helper function to generate date columns and map data
  // Map API data to table rows
  const generateStructuredData = () => {
    if (!dateRange.firstDay || !dateRange.lastDay) return

    const startDate = new Date(dateRange.firstDay)
    const endDate = new Date(dateRange.lastDay)
    const days = []

    // Generate columns for each day in the range
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateString = d.toISOString().split('T')[0]
      days.push(dateString)
    }

    const columns = {
      col1: {
        name: 'Employee Name',
        sortBy: 'name',
        allowsorting: false,
      },
      col2: {
        name: 'Project Name',
        sortBy: 'projectName',
        allowsorting: false,
      },
    }

    days.forEach((date, index) => {
      columns[`col${index + 3}`] = {
        name: date, // Column header
        sortBy: date,
        allowsorting: false, // No sorting for date columns
      }
    })

    columns[`col${Object.keys(columns).length + 1}`] = {
      name: 'Total', // Column header
      sortBy: 'total',
      allowsorting: false, // No sorting for date columns
    }

    // Map API data to table rows, grouping by both employee and project
    const rowData = []
    const groupedData = data.reduce((acc, item) => {
      const key = `${item.employee_id}-${item.project_id}`
      if (!acc[key]) {
        acc[key] = {
          name: `${item.Employee.name} id - ${item.employee_id}`, // Replace with employee name if available
          projectName: `${item.Project.name} id - ${item.project_id}`, // Replace with project name if available
        }
      }
      acc[key][item.date] = item.hours_worked
      return acc
    }, {})

    Object.keys(groupedData).forEach((key) => {
      const row = {
        name: groupedData[key].name,
        projectName: groupedData[key].projectName,
      }
      days.forEach((date) => {
        row[date] = groupedData[key][date] || '' // Default to empty if no data
      })
      let total = calculateTotalTime(row)
      row['total'] = total
      rowData.push(row)
    })

    setStructuredData({
      ...structuredData,
      columns,
      data: rowData,
      totalLength: rowData.length,
    })
  }

  // Fetch timesheet data based on selected filters
  const fetchTimesheetData = async (query) => {
    try {
      const fetchedData = await getTimesheetRecord(query)
      setData(fetchedData)
    } catch (error) {
      console.error('Error fetching timesheet data:', error)
    }
  }

  const DownloadExcel = async () => {
    try {
      isLoading(true)
      const startDate = new Date(dateRange.firstDay).toISOString().split('T')[0]
      const endDate = new Date(dateRange.lastDay).toISOString().split('T')[0]

      // Convert selected employees and projects to arrays of IDs
      const employeeIds = employees.map((emp) => emp.value)
      const projectIds = projects.map((proj) => proj.value)

      let data = await downloadTimesheetCsv({
        employee_id: employeeIds,
        project_id: projectIds,
        start_date: startDate,
        end_date: endDate,
        detailed:true
      })

      if (data && data.viewLink) {
        window.open(data.viewLink, '_blank')
        isLoading(false)
      } else {
        console.error('No file found in response')
      }
    } catch (error) {
      console.error('Error fetching timesheet data:', error)
    }
  }

  // Fetch data when filters change
  useEffect(() => {
    if (dateRange.firstDay && employees.length > 0 && projects.length > 0) {
      const startDate = new Date(dateRange.firstDay).toISOString().split('T')[0]
      const endDate = new Date(dateRange.lastDay).toISOString().split('T')[0]

      // Convert selected employees and projects to arrays of IDs
      const employeeIds = employees.map((emp) => emp.value)
      const projectIds = projects.map((proj) => proj.value)

      fetchTimesheetData({
        employee_id: employeeIds,
        project_id: projectIds,
        start_date: startDate,
        end_date: endDate,
      })
    } else {
      setData([])
    }
  }, [employees, dateRange, projects])

  // Regenerate structured data when data or date range changes
  useEffect(() => {
    generateStructuredData()
  }, [data, dateRange])

  return (
    <>
      <CRow className="align-items-center mb-3">
        <CCol xs={5} xl={2}>
          <h3>Reports/Detailed</h3>
        </CCol>
        <CCol className="flex-row-end">
          <div style={{ marginLeft: 10 }}>
            <Calender dateRange={dateRange} setDateRange={setDateRange} />
          </div>
        </CCol>
      </CRow>
      <CustomTable
        structuredData={structuredData}
        loading={false}
        showFooter={false}
        customHeader={() => {
          return (
            <CCardHeader style={{ background: '#e4eaee', borderRadius: 0 }}>
            <CRow className="align-items-center">
              <CCol >
                <CRow>
                  <CCol style={{ width: 'auto' }}>
                    <EmployeeDropdown
                      setEmployee={setEmployees} // Pass setEmployees for multi-select
                      employee={employees} // Pass employees array
                      customStyles={customStyles}
                      isMulti={true}
                      placeholder="Employee"
                    />
                  </CCol>
                  <CCol style={{ width: 'auto' }}>
                    <ProjectDropdown
                      setValue={setProjects} // Pass setProjects for multi-select
                      value={projects} // Pass projects array
                      customStyles={customStyles}
                      isMulti={true}
                      placeholder="Projects"
                    />
                  </CCol>
                </CRow>
              </CCol>
              <CCol style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <CButton color="primary" disabled={!data.length} onClick={() => DownloadExcel()}>
                  {loading ? (
                    'Preparing...'
                  ) : (
                    <CIcon
                      customClassName="nav-icon"
                      icon={cilPrint}
                      style={{
                        width: '15px',
                        height: '20px',
                        cursor: 'pointer',
                        color: 'white',
                      }}
                    />
                  )}
                </CButton>
              </CCol>
            </CRow>
          </CCardHeader>
          )
        }}
      />
    </>
  )
}

export default DetailedReports
