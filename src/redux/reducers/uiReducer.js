// src/redux/uiSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarShow: true,
  theme: 'light',
};

const uiSlice = createSlice({
  name: 'ui', // This is the name of the slice, used for accessing the state
  initialState,
  reducers: {
    // Action to toggle sidebar visibility
    setSidebarShow: (state, action) => {
      state.sidebarShow = action.payload;
    },
    // Action to set the theme
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    // Action to set both sidebar and theme at once
    setUiState: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

// Export the actions
export const { setSidebarShow, setTheme, setUiState } = uiSlice.actions;

// Export the reducer
export default uiSlice.reducer;
