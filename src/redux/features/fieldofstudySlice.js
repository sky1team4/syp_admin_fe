import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Fetch all field of study records
export const fetchFieldOfStudy = createAsyncThunk(
  'field-of-studies/',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching field of studies with token:', token);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/field-of-studies`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Fetch error response:', errorData);
        throw new Error(errorData.message || 'Failed to fetch field of study records');
      }

      return await response.json();
    } catch (error) {
      console.error('Fetch error:', error);
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Save field of study record
export const saveFieldOfStudy = createAsyncThunk(
  'field-of-studies/save',
  async (data, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Saving field of study with token:', token, 'and data:', data);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/field-of-studies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Save error response:', errorData);
        throw new Error(errorData.message || 'Failed to save field of study record');
      }

      return await response.json();
    } catch (error) {
      console.error('Save error:', error);
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Update field of study record
export const updateFieldOfStudy = createAsyncThunk(
  'field-of-studies/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Updating field of study with token:', token, 'and data:', data);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/field-of-studies/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Update error response:', errorData);
        throw new Error(errorData.message || 'Failed to update field of study record');
      }

      return await response.json();
    } catch (error) {
      console.error('Update error:', error);
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