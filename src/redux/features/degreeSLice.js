import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Fetch all degrees
export const fetchDegrees = createAsyncThunk(
  'degrees/findAll',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/degrees/findAll`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch degrees');
      }

      const data = await response.json();
      console.log('API Response:', data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

export const saveDegree = createAsyncThunk(
    'degrees/save',
    async (data, { dispatch, rejectWithValue }) => {
      try {
        const token = localStorage.getItem('token');
        const degreeData = {
          name: data.title?.trim(),
          status: data.status || 'Active',
          educationId: data.educationId || 1
        };
  
        // Debug log
        console.log('Sending degree data:', degreeData);
  
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/degrees/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(degreeData),
        });
  
        // Get the error message in case of failure
        const responseData = await response.json();
        
        if (!response.ok) {
          console.log('Error response:', responseData);
          throw new Error(responseData.message || 'Failed to create degree');
        }
  
        await dispatch(fetchDegrees());
        return responseData;
      } catch (error) {
        console.log('Error:', error);
        return rejectWithValue(error.message || 'Network error occurred');
      }
    }
  );

// Update degree
export const updateDegree = createAsyncThunk(
  'degrees/update',
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const degreeData = {
        id: id,
        name: data.title?.trim(),
        status: data.status || 'Active',
        educationId: data.educationId || 1
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/degrees/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(degreeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update degree');
      }

      await dispatch(fetchDegrees());
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Delete degree
export const deleteDegree = createAsyncThunk(
  'degrees/delete',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/degrees/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete degree');
      }

      await dispatch(fetchDegrees());
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

const degreeSlice = createSlice({
  name: 'degree',
  initialState: {
    items: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDegrees.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDegrees.fulfilled, (state, action) => {
        console.log('Setting state with:', action.payload);
        state.isLoading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchDegrees.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.items = [];
      })
      // Save cases
      .addCase(saveDegree.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveDegree.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.push(action.payload);
      })
      .addCase(saveDegree.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update cases
      .addCase(updateDegree.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateDegree.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateDegree.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete cases
      .addCase(deleteDegree.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteDegree.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(deleteDegree.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default degreeSlice.reducer;