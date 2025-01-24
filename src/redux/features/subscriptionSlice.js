import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Fetch all subscriptions
export const fetchSubscriptions = createAsyncThunk(
  'subscription/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
        // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3Mzc2NDE3NzEsImV4cCI6MTczNzY0NTM3MX0.aTaYNl0SvCRpYB98yjgPTcrITeTGtKlyQMHZ_VXHUbM";
      const response = await fetch('http://localhost:3000/subscriptions', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch subscriptions');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

export const saveSubscription = createAsyncThunk(
  'subscription/save',
  async (data, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Sending subscription data:', data); // Debug log

      const response = await fetch('http://localhost:3000/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server response:', errorData); // Debug log
        throw new Error(errorData.message || 'Failed to save subscription');
      }

      return await response.json();
    } catch (error) {
      console.error('Subscription error:', error); // Debug log
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState: {
    isLoading: false,
    error: null,
    subscriptions: [],
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch subscriptions cases
      .addCase(fetchSubscriptions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subscriptions = action.payload;
      })
      .addCase(fetchSubscriptions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.subscriptions = [];
      })
      // Save subscription cases
      .addCase(saveSubscription.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveSubscription.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subscriptions.push(action.payload);
      })
      .addCase(saveSubscription.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = subscriptionSlice.actions;
export default subscriptionSlice.reducer; 