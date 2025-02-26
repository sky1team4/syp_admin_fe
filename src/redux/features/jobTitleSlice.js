import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Fetch all job titles
export const fetchJobTitles = createAsyncThunk(
  'jobTitles/findAll',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/job-titles/findAll`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch job titles');
      }

      const data = await response.json();
      console.log('API Response:', data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Save job title
export const saveJobTitle = createAsyncThunk(
  'jobTitles/save',
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const jobTitleData = {
        name: data.title?.trim(),
        status: 'Active',
        // workExpId: 1  // Default workExpId
      };

      console.log('Sending job title data:', jobTitleData);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/job-titles/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(jobTitleData),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to create job title');
      }

      await dispatch(fetchJobTitles());
      return responseData;
    } catch (error) {
      console.error('Error creating job title:', error);
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Update job title
export const updateJobTitle = createAsyncThunk(
  'jobTitles/update',
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const jobTitleData = {
        id: id,
        name: data.title?.trim(),
        status: 'Active',
        workExpId: 1  // Default workExpId
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/job-titles/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(jobTitleData),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to update job title');
      }

      await dispatch(fetchJobTitles());
      return responseData;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Delete job title
export const deleteJobTitle = createAsyncThunk(
  'jobTitles/delete',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/job-titles/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete job title');
      }

      await dispatch(fetchJobTitles());
      return id;
    } catch (error) {
      console.error('Error deleting job title:', error);
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

const jobTitleSlice = createSlice({
  name: 'jobTitle',
  initialState: {
    items: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobTitles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJobTitles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchJobTitles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default jobTitleSlice.reducer;