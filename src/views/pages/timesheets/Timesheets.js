import React, { useState } from 'react'
import TimesheetTable from '../../../components/table/TimesheetTable'
import { CCol, CRow } from '@coreui/react'
import { AsyncPaginate } from 'react-select-async-paginate'
import { getAllEmployees } from '../../../apis/employeeApis'
//import { useToast } from '../../../components/toaster'
import Calender from '../../../components/calender/calneder'

const EmployeeDropdown = ({ setEmployee, employee }) => {
  const [currentPage, setCurrentPage] = useState(1) // To manage pagination
  const [isLoading, setIsLoading] = useState(false) // To manage loading state

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
      const data = await getAllEmployees(query)

      // Extract employees from the API response
      const employees = data.employees.map((employee) => ({
        value: employee.employee_id,
        label: employee.name,
      }))

      // Determine if more results are available for pagination
      const hasMore = currentPage < data.totalPages

      // Increase the current page for the next load
      if (hasMore) {
        setCurrentPage(currentPage + 1)
      }

      setIsLoading(false)
      return {
        options: employees,
        hasMore,
      }
    } catch (error) {
      setIsLoading(false)
      console.error('Error loading employees:', error)
      return {
        options: [],
        hasMore: false,
      }
    }
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
      cursor: 'pointer',
    }),
  }

  return (
    <AsyncPaginate
      styles={customStyles}
      options={[]} // Initial empty options list
      value={employee.value ? employee : null}
      loadOptions={loadOptions}
      onChange={setEmployee}
      isLoading={isLoading}
      debounceTimeout={500}
      placeholder="Search employees..."
      additional={{
        page: currentPage, // Pass current page to load more results
      }}
    />
  )
}

const Timesheet = () => {
  const [employee, setEmployee] = useState({ value: null, label: null })
  const [dateRange, setDateRange] = useState({ firstDay: null, lastDay: null })

  return (
    <>
      <CRow className="align-items-center mb-3">
        <CCol xs={5} xl={2}>
          <h3>Timesheet</h3>
        </CCol>
        <CCol className="flex-row-end">
          <div style={{ marginLeft: 10 }}>
            <Calender dateRange={dateRange} setDateRange={setDateRange} />
          </div>
          <EmployeeDropdown setEmployee={setEmployee} employee={employee} />
        </CCol>
      </CRow>
      <TimesheetTable employeeId={employee.value} dateRange={dateRange} />
    </>
  )
}

export default Timesheet
