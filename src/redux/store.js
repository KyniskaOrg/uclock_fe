import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // LocalStorage
import authReducer from './reducers/authReducer';  
import uiReducer from './reducers/uiReducer';  

// Define persist config
const persistConfig = {
  key: 'root',
  storage, // Use localStorage to persist the store
  whitelist: ['auth'], // Only persist the 'auth' slice
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
});

// Create persist reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with persisted reducer
const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store); // Create persistor
export default store;
