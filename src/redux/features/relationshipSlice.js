import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Function to get the JWT token
const getToken = () => {
  return localStorage.getItem('token');
};

// Async thunk to fetch relationships
export const fetchRelationships = createAsyncThunk('relationships/findAll', async (_, { rejectWithValue }) => {
  try {
    const token = getToken();
    const response = await axios.post(`${BASE_URL}/relationships/findAll`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Async thunk to create a relationship
export const saveRelationship = createAsyncThunk(
  'relationships/create',
  async (relationship, { dispatch, rejectWithValue }) => {
    try {
      const token = getToken();
      
      // Change title to name to match backend expectations
      const relationshipData = {
        name: relationship.title?.trim(), // Convert title to name
        status: relationship.status || 'Active'
      };

      console.log('Sending request to:', `${BASE_URL}/relationships/create`);
      console.log('With data:', relationshipData);
      console.log('Headers:', {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
      
      const response = await axios.post(
        `${BASE_URL}/relationships/create`,
        relationshipData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Success response:', response.data);
      await dispatch(fetchRelationships());
      return response.data;
    } catch (error) {
      // Add this detailed error logging
      console.error('Full error response:', JSON.stringify(error.response?.data, null, 2));
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to update a relationship
export const updateRelationship = createAsyncThunk(
  'relationships/update',
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      const token = getToken();
      
      // Transform the data to match backend expectations and include id
      const relationshipData = {
        id: id,
        name: data.title?.trim(), // Convert title to name
        status: data.status || 'Active'
      };

      console.log('Updating relationship:', {
        url: `${BASE_URL}/relationships/update`,
        data: relationshipData
      });

      const response = await axios.post(
        `${BASE_URL}/relationships/update`,
        relationshipData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      await dispatch(fetchRelationships());
      return response.data;
    } catch (error) {
      console.error('Update error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to delete a relationship
export const deleteRelationship = createAsyncThunk('relationships/delete', async (id, { dispatch, rejectWithValue }) => {
  try {
    const token = getToken();
    await axios.post(`${BASE_URL}/relationships/delete`, { id }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    await dispatch(fetchRelationships()); // Refresh data after deletion
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Relationship Slice
const relationshipSlice = createSlice({
  name: 'relationships',
  initialState: {
    items: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRelationships.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRelationships.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchRelationships.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch relationships';
      })
      .addCase(saveRelationship.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateRelationship.fulfilled, (state, action) => {
        state.items = state.items.map((relationship) =>
          relationship.id === action.payload.id ? action.payload : relationship
        );
      })
      .addCase(deleteRelationship.fulfilled, (state, action) => {
        state.items = state.items.filter((relationship) => relationship.id !== action.payload);
      });
  },
});

export default relationshipSlice.reducer;
