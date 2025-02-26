import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { format } from 'date-fns';

// Fetch all field of study records
export const fetchFieldOfStudy = createAsyncThunk(
  'field-of-studies/',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/field-of-studies/findAll`, {
        method: 'GET',
        headers: {
          // 'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch field of study records');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Save field of study record
export const saveFieldOfStudy = createAsyncThunk(
  'field-of-studies/save',
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const fieldOfStudyData = {
        name: data.title?.trim(),
        status: data.status || 'Active'
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/field-of-studies/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(fieldOfStudyData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save field of study record');
      }

      await dispatch(fetchFieldOfStudy());
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Update field of study record
export const updateFieldOfStudy = createAsyncThunk(
  'field-of-studies/update',
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      
      // Transform the data to match backend expectations
      const fieldOfStudyData = {
        name: data.title?.trim(),
        status: data.status || 'Active'
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/field-of-studies/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(fieldOfStudyData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update field of study record');
      }

      // Refresh the data after successful update
      await dispatch(fetchFieldOfStudy());
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Delete field of study record
export const deleteFieldOfStudy = createAsyncThunk(
  'field-of-studies/delete',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Deleting field of study with token:', token, 'and id:', id);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/field-of-studies/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Delete error response:', errorData);
        throw new Error(errorData.message || 'Failed to delete field of study record');
      }

      return id;
    } catch (error) {
      console.error('Delete error:', error);
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

const fieldofstudySlice = createSlice({
  name: 'field-of-studies',
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
      .addCase(fetchFieldOfStudy.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFieldOfStudy.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchFieldOfStudy.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Save cases
      .addCase(saveFieldOfStudy.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveFieldOfStudy.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.push(action.payload);
      })
      .addCase(saveFieldOfStudy.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update cases
      .addCase(updateFieldOfStudy.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateFieldOfStudy.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateFieldOfStudy.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete cases
      .addCase(deleteFieldOfStudy.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteFieldOfStudy.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(deleteFieldOfStudy.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default fieldofstudySlice.reducer;