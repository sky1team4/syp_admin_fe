import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Fetch all interests
export const fetchInterests = createAsyncThunk(
  'interests/findAll',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/interests/findAll`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch interests');
      }

      const data = await response.json();
      console.log('API Response:', data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Save interest
export const saveInterest = createAsyncThunk(
  'interests/save',
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const interestData = {
        name: data.title?.trim(),
        status: 'Active',
        image: "https://example.com/default-interest.jpg",  // Required field with default value
        profileId: 1  // Required field with default value
      };

      console.log('Request Data:', interestData);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/interests/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(interestData),
      });

      const responseData = await response.json();
      console.log('Response Data:', responseData);

      if (!response.ok) {
        throw new Error(responseData.message || responseData.error || 'Failed to create interest');
      }

      await dispatch(fetchInterests());
      return responseData;
    } catch (error) {
      console.error('Error details:', error);
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Update interest
export const updateInterest = createAsyncThunk(
  'interests/update',
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const interestData = {
        id: id,
        name: data.title?.trim(),
        status: 'Active',
        image: "https://example.com/default-interest.jpg",  // Required field with default value
        profileId: 1
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/interests/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(interestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update interest');
      }

      await dispatch(fetchInterests());
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Delete interest
export const deleteInterest = createAsyncThunk(
  'interests/delete',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/interests/delete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete interest');
      }

      await dispatch(fetchInterests());
      return id;
    } catch (error) {
      console.error('Delete Error:', error);
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

const interestSlice = createSlice({
  name: 'interest',
  initialState: {
    items: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInterests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInterests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchInterests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(saveInterest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveInterest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.push(action.payload);
      })
      .addCase(saveInterest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateInterest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateInterest.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateInterest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteInterest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteInterest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(deleteInterest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default interestSlice.reducer;