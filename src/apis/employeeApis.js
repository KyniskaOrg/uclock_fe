import axios from 'axios'
const backendUrl = import.meta.env.VITE_APP_NODE_API

const BASE_URL = `${backendUrl}/api/employee`

/**
 * Create a new employee
 * @param {Object} payload - The project data
 * @param {string} payload.employeeName - The name of the project
 * @param {string} payload.employeeEmail - The name of the project
 *
 * @returns {Promise} - Axios response promise
 */
const createEmployee = async (payload) => {
  try {
    const response = await axios.post(`${BASE_URL}/createEmployee`, payload)
    return response.data // Return the data from the response
  } catch (error) {
    console.error('Error creating employee:', error.response?.data || error.message)
    throw error
  }
}

/**
 * Edit a new employee
 * @param {Object} payload - The project data
 * @param {string} payload.name - The name of the project
 * @param {string} payload.employee_id - The name of the project
 * @returns {Promise} - Axios response promise
 */
const editEmployee = async (payload) => {
  try {
    const response = await axios.post(`${BASE_URL}/editEmployee`, payload)
    return response.data // Return the data from the response
  } catch (error) {
    console.error('Error updating employee:', error.response?.data || error.message)
    throw error
  }
}

/**
 * delete employee
 * @param {string} payload.employee_id - The name of the project
 * @param {string} payload.position - The name of the project
 * @returns {Promise} - Axios response promise
 */
const setEmployeePosition = async (payload) => {
  try {
    const response = await axios.post(`${BASE_URL}/setEmployeePosition`, payload)
    return response.data // Return the data from the response
  } catch (error) {
    console.error('Error updating employee:', error.response?.data || error.message)
    throw error
  }
}

/**
 * delete employee
 * @param {string} payload.employee_id - The name of the project
 * @returns {Promise} - Axios response promise
 */
const deleteEmployee = async (payload) => {
  try {
    const response = await axios.post(`${BASE_URL}/deleteEmployee`, payload)
  } catch (error) {
    console.error('Error deleting employee:', error.response?.data || error.message)
    throw error
  }
}

/**
 * Fetch all projects with pagination, sorting, and filtering
 * @param {Object} payload - The parameters for fetching projects
 * @param {number} [payload.page=1] - The page number (default is 1)
 * @param {string} [payload.sortBy='name'] - The field by which to sort the projects (default is 'name')
 * @param {string} [payload.sortOrder='ASC'] - The sorting order, either 'ASC' (ascending) or 'DESC' (descending)
 * @param {string} [payload.projectName=''] - The project name filter (optional, empty string for no filter)
 * @returns {Promise} - Axios response promise with project data
 */
const getAllEmployees = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}/getAllEmployees`, {
      params: {
        ...query,
      },
    })
    return response.data // Return the data from the response
  } catch (error) {
    console.error('Error fetching employees:', error.response?.data || error.message)
    throw error
  }
}

/**
 * Get timesheet record
 * @param {Object} params - Query parameters
 * @param {number} params.employee_id - The ID of the employee
 * @param {string} params.start_date - The start date (YYYY-MM-DD)
 * @param {string} params.end_date - The end date (YYYY-MM-DD)
 * @returns {Promise} - Axios response promise
 */
const getEmployeesWithNoEntry = async (params) => {
  try {
    const response = await axios.get(`${BASE_URL}/getEmployeesWithNoEntry`, {
      params, // Axios automatically appends query parameters
    })
    return response.data // Return the data from the response
  } catch (error) {
    console.error('Error getting month total hours:', error.response?.data || error.message)
    throw error
  }
}

export {
  createEmployee,
  getAllEmployees,
  editEmployee,
  deleteEmployee,
  getEmployeesWithNoEntry,
  setEmployeePosition,
}
