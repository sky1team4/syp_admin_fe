import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;
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

export const fetchStripeConfig = createAsyncThunk(
  'stripe/fetchConfig',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stripe`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to fetch configuration');
      }

      const data = await response.json();
      console.log('API Response:', data);
      return data;
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
      .addCase(saveStripeConfig.fulfilled, (state, action) => {
        state.isLoading = false;
        state.config = action.payload;
      })
      .addCase(saveStripeConfig.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchStripeConfig.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        console.log('Fetch pending');
      })
      .addCase(fetchStripeConfig.fulfilled, (state, action) => {
        state.isLoading = false;
        state.config = action.payload;
        console.log('Fetch fulfilled:', action.payload);
      })
      .addCase(fetchStripeConfig.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        console.log('Fetch rejected:', action.payload);
      });
  },
});

export const { clearError } = stripeSlice.actions;
export default stripeSlice.reducer;