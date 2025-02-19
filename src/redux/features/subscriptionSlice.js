import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;
// Fetch all subscriptions
export const fetchSubscriptions = createAsyncThunk(
  'subscription/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscriptions`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log(response.data);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch subscriptions');
      }

      const data = await response.json();
      return data.map(subscription => ({
        ...subscription,
        billingPeriod: subscription.billingPeriod === 'YEARLY' ? 'ANNUAL' : subscription.billingPeriod
      }));
    } catch (error) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Helper function to convert billing period
const convertBillingPeriod = (period) => {
  if (!period) return 'MONTHLY';
  return period === 'ANNUAL' ? 'YEARLY' : period.toUpperCase();
};

export const saveSubscription = createAsyncThunk(
  'subscription/save',
  async (data, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const subscriptionData = {
        name: data.name,
        price: parseFloat(data.price),
        status: data.status.toUpperCase(),
        billingPeriod: convertBillingPeriod(data.billingPeriod)
      };

      console.log('Sending subscription data:', subscriptionData);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscriptions`, {
        method: 'POST',
        headers: {

          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(subscriptionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error Response:', errorData);
        throw new Error(errorData.message || 'Failed to save subscription');
      }

      const result = await response.json();
      console.log('API Success Response:', result);
      return result;
    } catch (error) {
      console.error('Subscription Error:', error);
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Add update subscription thunk
export const updateSubscription = createAsyncThunk(
  'subscription/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const subscriptionData = {
        name: data.name,
        price: parseFloat(data.price),
        status: data.status.toUpperCase(),
        billingPeriod: convertBillingPeriod(data.billingPeriod)
      };

      console.log('Updating subscription data:', subscriptionData);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscriptions/${id}`, {
        method: 'PATCH',
        headers: {

          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(subscriptionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Update Error Response:', errorData);
        throw new Error(errorData.message || 'Failed to update subscription');
      }

      const result = await response.json();
      console.log('Update Success Response:', result);
      
      // Convert YEARLY back to ANNUAL for frontend display
      return {
        ...result,
        billingPeriod: result.billingPeriod === 'YEARLY' ? 'ANNUAL' : result.billingPeriod
      };
    } catch (error) {
      console.error('Update Error:', error);
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Add delete subscription thunk
export const deleteSubscription = createAsyncThunk(
  'subscription/delete',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscriptions/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log(response);
      console.log(response.status);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete subscription');
      }

      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

export const fetchMonthlyCount = createAsyncThunk(
  'subscriptions/fetchMonthlyCount',
  async (subscriptionId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscriptions/count-monthly/${subscriptionId}`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log("response",response.status);
      console.log("response",response.data);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch monthly count');
      }
      const data = await response.json();
      return data; // Assuming the API returns the count directly
    } catch (error) {
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
      })
      // Update subscription cases
      .addCase(updateSubscription.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateSubscription.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.subscriptions.findIndex(
          (sub) => sub.id === action.payload.id
        );
        if (index !== -1) {
          state.subscriptions[index] = action.payload;
        }
      })
      .addCase(updateSubscription.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete subscription cases
      .addCase(deleteSubscription.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteSubscription.fulfilled, (state, action) => {
        state.isLoading = false;
        // Ensure the server confirms deletion before removing from state
        if (action.payload) {
          state.subscriptions = state.subscriptions.filter(
            subscription => subscription.id !== action.payload
          );
        }
      })
      .addCase(deleteSubscription.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchMonthlyCount.pending, (state) => {
        state.isLoading = true;
    })
    .addCase(fetchMonthlyCount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.monthlyCount = action.payload; // Set the count
    })
    .addCase(fetchMonthlyCount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message; // Handle error
    })
  },
});

export const { clearError } = subscriptionSlice.actions;
export default subscriptionSlice.reducer; 