import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const saveBankConfig = createAsyncThunk(
  'bank/saveConfig',
  async (data, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bank`, {
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

const bankSlice = createSlice({
  name: 'bank',
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
      .addCase(saveBankConfig.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveBankConfig.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(saveBankConfig.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = bankSlice.actions;
export default bankSlice.reducer; 