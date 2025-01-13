import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/client';

/**
 * Create a new client
 * @param {Object} payload - The project data
 * @param {string} payload.clientname - The name of the project
 * @returns {Promise} - Axios response promise
 */
const createClient = async (payload) => {
  try {
    const response = await axios.post(`${BASE_URL}/createClient`, payload);
    return response.data; // Return the data from the response
  } catch (error) {
    console.error('Error creating client:', error.response?.data || error.message);
  }
};


/**
 * Fetch all projects with pagination, sorting, and filtering
 * @param {Object} payload - The parameters for fetching projects
 * @param {number} [payload.page=1] - The page number (default is 1)
 * @param {string} [payload.sortBy='name'] - The field by which to sort the projects (default is 'name')
 * @param {string} [payload.sortOrder='ASC'] - The sorting order, either 'ASC' (ascending) or 'DESC' (descending)
 * @param {string} [payload.projectName=''] - The project name filter (optional, empty string for no filter)
 * @returns {Promise} - Axios response promise with project data
 */
const getAllClients = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}/getAllClients`, {
      params: {
       ...query
      },
    });
    return response.data; // Return the data from the response
  } catch (error) {
    console.error('Error fetching clients:', error.response?.data || error.message);
  }
};

export {createClient,getAllClients}
