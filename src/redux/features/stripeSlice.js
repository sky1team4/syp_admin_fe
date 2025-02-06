import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const saveStripeConfig = createAsyncThunk(
  'stripe/saveConfig',
  async (data, { rejectWithValue, getState }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stripe`, {
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

const stripeSlice = createSlice({
  name: 'stripe',
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
      .addCase(saveStripeConfig.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveStripeConfig.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(saveStripeConfig.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearError } = stripeSlice.actions;
export default stripeSlice.reducer; 