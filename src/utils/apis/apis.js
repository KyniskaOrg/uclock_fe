// src/utils/api.js
import axios from 'axios'

const API_URL = 'http://localhost:3000/api/auth'

// Register User API Call
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData)
    return response.data
  } catch (error) {
    throw error.response?.data || 'Registration failed'
  }
}
