import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import authReducer from './reducers/authReducer';  // Your new slice reducer
import uiReducer from './reducers/uiReducer';  // Import the legacy reducer

// Combine both reducers
const rootReducer = combineReducers({
  auth: authReducer, // New slice reducer
  ui: uiReducer,    // Legacy reducer (e.g., sidebar and theme state)
});

const store = configureStore({
  reducer: rootReducer,  // Use the combined reducer here
});

export default store;
