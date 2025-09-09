import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

// Fetch all subscription types
export const fetchSubscriptionTypes = createAsyncThunk(
  'subscriptionTypes/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscription-types`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch subscription types');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Fetch active subscription types (public endpoint)
export const fetchActiveSubscriptionTypes = createAsyncThunk(
  'subscriptionTypes/fetchActive',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscription-types/active`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch active subscription types');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Fetch active subscription types error:', error);
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Create subscription type
export const createSubscriptionType = createAsyncThunk(
  'subscriptionTypes/create',
  async (data, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const subscriptionTypeData = {
        name: data.name,
        modules: data.modules,
        status: data.status.toUpperCase()
      };

      console.log('Sending subscription type data:', subscriptionTypeData);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscription-types`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(subscriptionTypeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error Response:', errorData);
        throw new Error(errorData.message || 'Failed to create subscription type');
      }

      const result = await response.json();
      console.log('API Success Response:', result);
      return result;
    } catch (error) {
      console.error('Subscription Type Error:', error);
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Update subscription type
export const updateSubscriptionType = createAsyncThunk(
  'subscriptionTypes/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const subscriptionTypeData = {
        name: data.name,
        modules: data.modules,
        status: data.status.toUpperCase()
      };

      console.log('Updating subscription type with data:', subscriptionTypeData);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscription-types/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(subscriptionTypeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error Response:', errorData);
        throw new Error(errorData.message || 'Failed to update subscription type');
      }

      const result = await response.json();
      console.log('API Success Response:', result);
      return result;
    } catch (error) {
      console.error('Subscription Type Update Error:', error);
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Delete subscription type
export const deleteSubscriptionType = createAsyncThunk(
  'subscriptionTypes/delete',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Attempting to delete subscription type:', id);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subscription-types/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error Response:', errorData);
        throw new Error(errorData.message || 'Failed to delete subscription type');
      }

      const result = await response.json();
      console.log('Delete Success Response:', result);
      return { id, ...result };
    } catch (error) {
      console.error('Subscription Type Delete Error:', error);
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

const subscriptionTypesSlice = createSlice({
  name: 'subscriptionTypes',
  initialState: {
    isLoading: false,
    error: null,
    subscriptionTypes: [],
    activeSubscriptionTypes: [],
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch subscription types cases
      .addCase(fetchSubscriptionTypes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionTypes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subscriptionTypes = action.payload;
      })
      .addCase(fetchSubscriptionTypes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.subscriptionTypes = [];
      })
      // Fetch active subscription types cases
      .addCase(fetchActiveSubscriptionTypes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchActiveSubscriptionTypes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeSubscriptionTypes = action.payload;
      })
      .addCase(fetchActiveSubscriptionTypes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.activeSubscriptionTypes = [];
      })
      // Create subscription type cases
      .addCase(createSubscriptionType.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createSubscriptionType.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subscriptionTypes.push(action.payload);
      })
      .addCase(createSubscriptionType.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update subscription type cases
      .addCase(updateSubscriptionType.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateSubscriptionType.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.subscriptionTypes.findIndex(
          (type) => type.id === action.payload.id
        );
        if (index !== -1) {
          state.subscriptionTypes[index] = action.payload;
        }
      })
      .addCase(updateSubscriptionType.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete subscription type cases
      .addCase(deleteSubscriptionType.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteSubscriptionType.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subscriptionTypes = state.subscriptionTypes.filter(
          (type) => type.id !== action.payload.id
        );
      })
      .addCase(deleteSubscriptionType.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = subscriptionTypesSlice.actions;
export default subscriptionTypesSlice.reducer;
