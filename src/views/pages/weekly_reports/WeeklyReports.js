import React, { useState, useEffect } from 'react'
import { CCol, CRow, CCardHeader, CButton } from '@coreui/react'
import CustomTable from '../../../components/table/table'
import DateRange from '../../../components/dateRange/DateRangePicker'
import { endOfMonth, startOfMonth } from 'date-fns'
import EmployeeDropdown from '../../../components/EmployeeDropDown'
import ProjectDropdown from '../../../components/ProjectDropDown'
import { getAllTimesheetRecords, downloadTimesheetCsv } from '../../../apis/timesheetApis'
import { cilPrint } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const WeeklyReports = () => {
  const [dateRange, setDateRange] = useState({
    startDate: startOfMonth(new Date(), { weekStartsOn: 1 }),
    endDate: endOfMonth(new Date(), { weekStartsOn: 1 }),
    key: 'selection',
  })
  const [employees, setEmployees] = useState([]) // Array of selected employees
  const [projects, setProjects] = useState([])
  const [loading, isLoading] = useState(false) // Array of selected projects
  const [totalCount, setTotalCount] = useState(0) // To track if data is being fetched

  // Array of selected projects
  const [filter, setFilter] = useState({
    searchText: '',
    sortBy: null,
    sortOrder: null,
    page: 1,
    limit: 30,
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

  // Helper function to generate date columns and map data
  // Map API data to table rows
  const generateStructuredData = () => {
    if (!dateRange.startDate || !dateRange.endDate) return

    const columns = {
      col1: {
        name: 'Project Name',
        sortBy: 'projectName',
        allowsorting: false,
      },
      col2: {
        name: 'Employee Name',
        sortBy: 'name',
        allowsorting: false,
      },
      col3: {
        name: 'Date',
        sortBy: 'date',
        allowsorting: false,
      },
      col4: {
        name: 'Time(h)',
        sortBy: 'hours_worked',
        allowsorting: false,
      },
      col5: {
        name: 'Time(Decimal)',
        sortBy: 'hours_worked_decimal',
        allowsorting: false,
      },
      col6: {
        name: 'Regular/Night',
        sortBy: 'work_type',
        allowsorting: false,
      },
    }

    function timeToDecimal(timeString) {
      const [hours, minutes] = timeString.split(':').map(Number)
      return (hours + minutes / 60).toFixed(2)
    }

    // Map API data to table rows, grouping by both employee and project
    let rowData = []
    data.forEach((entry) => {
      rowData.push({
        projectName: entry.Project.name,
        name: entry.Employee.name,
        date: entry.date,
        hours_worked: entry.hours_worked,
        hours_worked_decimal: timeToDecimal(entry.hours_worked),
        work_type: entry.work_type,
      })
    })

    setStructuredData({
      columns,
      data: rowData,
      totalLength: totalCount,
      setFilter: setFilter,
      filter: filter,
      searchableTable: false,
    })
  }

  // Fetch timesheet data based on selected filters
  const fetchTimesheetData = async (query) => {
    try {
      const fetchedData = await getAllTimesheetRecords(query)
      setData(fetchedData.timesheets)
      setTotalCount(fetchedData.totalRecords)
    } catch (error) {
      console.error('Error fetching timesheet data:', error)
    }
  }

  const DownloadExcel = async () => {
    try {
      isLoading(true)
      const startDate = new Date(dateRange.startDate).toISOString().split('T')[0]
      const endDate = new Date(dateRange.endDate).toISOString().split('T')[0]

      let data = await downloadTimesheetCsv({
        employee_id: employees.length ? mapIdsToArray(employees) : null,
        project_id: projects.length ? mapIdsToArray(projects) : null,
        start_date: startDate,
        end_date: endDate,
        page: filter.page,
        limit: filter.limit,
        detailed: false,
      })
      // if (data && data.viewLink) {
       
      //   window.open(data.viewLink, '_blank')
      //   isLoading(false)
      // } else {
      //   console.error('No file found in response')
      // }

      if (data && data.downloadLink) {
        // Create an anchor element to trigger the download
        const a = document.createElement('a')
        a.href = data.downloadLink  // The link for the CSV file
        a.download = 'timesheet.csv' // Set the filename you want for the download
        document.body.appendChild(a) // Append the link to the DOM (it needs to be in the document for it to work)
        a.click() // Simulate a click on the link to start the download
        document.body.removeChild(a) // Remove the link after the click
  
        isLoading(false)
      } else {
        console.error('No file found in response')
      }
    } catch (error) {
      console.error('Error fetching timesheet data:', error)
      isLoading(false)
    }
  }

  function mapIdsToArray(data) {
    return data.map((item) => item.value)
  }

  // Fetch data when filters change
  useEffect(() => {
    if (dateRange.startDate || dateRange.endDate || employees.length || projects.length) {
      const startDate = new Date(dateRange.startDate).toISOString().split('T')[0]
      const endDate = new Date(dateRange.endDate).toISOString().split('T')[0]

      fetchTimesheetData({
        employee_id: employees.length ? mapIdsToArray(employees) : null,
        project_id: projects.length ? mapIdsToArray(projects) : null,
        start_date: startDate,
        end_date: endDate,
        page: filter.page,
        limit: filter.limit,
      })
    } else {
      setData([])
    }
  }, [employees, dateRange, projects, filter])

  // Regenerate structured data when data or date range changes
  useEffect(() => {
    generateStructuredData()
  }, [data])

  return (
    <>
      <CRow className="align-items-center mb-3">
        <CCol xs={5} xl={2}>
          <h3>Reports</h3>
        </CCol>
        <CCol style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <CRow>
            <CCol style={{ width: 'auto' }}>
              <DateRange dateRange={dateRange} setDateRange={setDateRange} />
            </CCol>
          </CRow>
        </CCol>
      </CRow>
      <CustomTable
        structuredData={structuredData}
        loading={false}
        showFooter={true}
        customHeader={() => {
          return (
            <CCardHeader style={{ background: '#e4eaee', borderRadius: 0 }}>
              <CRow className="align-items-center">
                <CCol>
                  <CRow>
                    <CCol style={{ width: 'auto' }}>
                      <EmployeeDropdown
                        isMulti={true}
                        setEmployee={setEmployees} // Pass setEmployees for multi-select
                        employee={employees} // Pass employees array
                        customStyles={customStyles}
                        placeholder="Employee"
                      />
                    </CCol>
                    <CCol style={{ width: 'auto' }}>
                      <ProjectDropdown
                        isMulti={true}
                        setValue={setProjects} // Pass setProjects for multi-select
                        value={projects} // Pass projects array
                        customStyles={customStyles}
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

export default WeeklyReports
