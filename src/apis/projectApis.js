import axios from 'axios'
const backendUrl=import.meta.env.VITE_APP_NODE_API

const BASE_URL = `${backendUrl}/api/project`

/**
 * Create a new project
 * @param {Object} payload - The project data
 * @param {string} payload.projectName - The name of the project
 * @param {string|null} [payload.clientId] - The ID of the client (optional)
 * @returns {Promise} - Axios response promise
 */
const createProject = async (payload) => {
  try {
    const response = await axios.post(`${BASE_URL}/createProject`, payload)
    return response.data // Return the data from the response
  } catch (error) {
    console.error('Error creating project:', error.response?.data || error.message)
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
const getAllProjects = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}/getAllProjects`, {
      params: {
        ...query,
      },
    })
    return response.data // Return the data from the response
  } catch (error) {
    console.error('Error fetching projects:', error.response?.data || error.message)
    throw error
  }
}

export { createProject, getAllProjects }
