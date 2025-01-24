import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const savePaypalConfig = createAsyncThunk(
  'paypal/saveConfig',
  async (data, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/paypal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to save configuration');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

const paypalSlice = createSlice({
  name: 'paypal',
  initialState: {
    isLoading: false,
    error: null,
    config: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(savePaypalConfig.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(savePaypalConfig.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(savePaypalConfig.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = paypalSlice.actions;
export default paypalSlice.reducer; 