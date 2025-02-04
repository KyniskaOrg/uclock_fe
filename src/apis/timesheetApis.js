import axios from 'axios'

const BASE_URL = 'http://localhost:3000/api/timesheet'

/**
 * Set timesheet record
 * @param {Object} payload - The timesheet data
 * @param {number} payload.employee_id - The ID of the employee
 * @param {number} payload.project_id - The ID of the project
 * @param {string} payload.date - The date (YYYY-MM-DD)
 * @param {string} payload.hours_worked - The hours worked (HH:MM format)
 * @returns {Promise} - Axios response promise
 */
const setTimesheetRecord = async (payload) => {
  try {
    const response = await axios.post(`${BASE_URL}/setTimesheetRecord`, payload)
    return response.data // Return the data from the response
  } catch (error) {
    console.error('Error setting timesheet record:', error.response?.data || error.message)
    throw error
  }
}

/**
 * Get timesheet record
 * @param {Object} params - Query parameters
 * @param {number} params.employee_id - The ID of the employee
 * @param {number} params.project_id - The ID of the project
 * @param {string} params.start_date - The start date (YYYY-MM-DD)
 * @returns {Promise} - Axios response promise
 */
const getTimesheetRecord = async (params) => {
  try {
    const response = await axios.get(`${BASE_URL}/getTimesheetRecord`, {
      params, // Axios automatically appends query parameters
    })
    return response.data // Return the data from the response
  } catch (error) {
    console.error('Error getting timesheet record:', error.response?.data || error.message)
    throw error
  }
}

/**
 * Delete timesheet records
 * @param {Array<number>} timesheetIds - Array of timesheet IDs to delete
 * @returns {Promise} - Axios response promise
 */
const deleteTimesheetRecords = async (timesheetIds) => {
  try {
    const response = await axios.post(`${BASE_URL}/deleteTimesheetRecord`, {
      timesheet_ids: timesheetIds, // Send the array in the request body
    })
    return response.data // Return the data from the response
  } catch (error) {
    console.error('Error deleting timesheet records:', error.response?.data || error.message)
    throw error
  }
}

/**
 * download timesheet csv
 * @param {Object} params - Query parameters
 * @param {number} params.employee_id - The ID of the employee
 * @param {number} params.project_id - The ID of the project
 * @param {string} params.start_date - The start date (YYYY-MM-DD)
 * @returns {Promise} - Axios response promise
 */
const downloadTimesheetCsv = async (params) => {
  try {
    const response = await axios.get(`${BASE_URL}/downloadTimesheetCsv`, {
      params, // Axios automatically appends query parameters
    })
    return response.data // Return the data from the response
  } catch (error) {
    console.error('Error getting timesheet record:', error.response?.data || error.message)
    throw error
  }
}

export { setTimesheetRecord, getTimesheetRecord, deleteTimesheetRecords, downloadTimesheetCsv }
