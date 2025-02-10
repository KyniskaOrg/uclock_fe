// src/utils/api.js
import axios from 'axios'
const backendUrl=import.meta.env.VITE_APP_NODE_API

const API_URL = `${backendUrl}/api/auth`

// Register User API Call
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData)
    return response.data
  } catch (error) {
    throw error.response?.data || 'Registration failed'
  }
}
