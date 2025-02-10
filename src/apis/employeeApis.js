import axios from 'axios'
const backendUrl=import.meta.env.VITE_APP_NODE_API

const BASE_URL = `${backendUrl}/api/employee`

/**
 * Create a new employee
 * @param {Object} payload - The project data
 * @param {string} payload.employeeName - The name of the project
 * @returns {Promise} - Axios response promise
 */
const createEmployee = async (payload) => {
  try {
    const response = await axios.post(`${BASE_URL}/createEmployee`, payload)
    return response.data // Return the data from the response
  } catch (error) {
    console.error('Error creating employee:', error.response?.data || error.message)
    throw error;
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

export { createEmployee, getAllEmployees }
