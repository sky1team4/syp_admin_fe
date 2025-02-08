import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Fetch all field of study records
export const fetchFieldOfStudy = createAsyncThunk(
  'fieldOfStudy/fetchAll', // Updated action type
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/field-of-studies`, { // Updated endpoint
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch field of study records');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Save field of study record
export const saveFieldOfStudy = createAsyncThunk(
  'fieldOfStudy/save', // Updated action type
  async (data, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/field-of-studies`, { // Updated endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save field of study record');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Update field of study record
export const updateFieldOfStudy = createAsyncThunk(
  'fieldOfStudy/update', // Updated action type
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/field-of-studies/${id}`, { // Updated endpoint
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update field of study record');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Delete field of study record
export const deleteFieldOfStudy = createAsyncThunk(
  'fieldOfStudy/delete', // Updated action type
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/field-of-studies/${id}`, { // Updated endpoint
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete field of study record');
      }

      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

const educationSlice = createSlice({
  name: 'fieldOfStudy', // Updated slice name
  initialState: {
    items: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch cases
      .addCase(fetchFieldOfStudy.pending, (state) => { // Updated action
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFieldOfStudy.fulfilled, (state, action) => { // Updated action
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchFieldOfStudy.rejected, (state, action) => { // Updated action
        state.isLoading = false;
        state.error = action.payload;
      })
      // Save cases
      .addCase(saveFieldOfStudy.pending, (state) => { // Updated action
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveFieldOfStudy.fulfilled, (state, action) => { // Updated action
        state.isLoading = false;
        state.items.push(action.payload);
      })
      .addCase(saveFieldOfStudy.rejected, (state, action) => { // Updated action
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update cases
      .addCase(updateFieldOfStudy.pending, (state) => { // Updated action
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateFieldOfStudy.fulfilled, (state, action) => { // Updated action
        state.isLoading = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateFieldOfStudy.rejected, (state, action) => { // Updated action
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete cases
      .addCase(deleteFieldOfStudy.pending, (state) => { // Updated action
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteFieldOfStudy.fulfilled, (state, action) => { // Updated action
        state.isLoading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(deleteFieldOfStudy.rejected, (state, action) => { // Updated action
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default educationSlice.reducer; 