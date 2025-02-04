import { useState } from 'react'
import { AsyncPaginate } from 'react-select-async-paginate'
import { getAllEmployees } from '../apis/employeeApis'
import zIndex from '@mui/material/styles/zIndex'

const EmployeeDropdown = ({
  setEmployee,
  employee,
  customStyles,
  placeholder,
  isMulti = false,
}) => {
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

  const stylesProps = customStyles
    ? customStyles
    : {
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
    <AsyncPaginate
      styles={stylesProps}
      options={[]} // Initial empty options list
      value={employee.length ? employee : employee.value ? employee : null}
      loadOptions={loadOptions}
      onChange={setEmployee}
      isLoading={isLoading}
      debounceTimeout={500}
      placeholder={placeholder ? placeholder : 'Search employees...'}
      additional={{
        page: currentPage, // Pass current page to load more results
      }}
      isMulti={isMulti}
    />
  )
}

export default EmployeeDropdown
