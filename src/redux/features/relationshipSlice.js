import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Function to get the JWT token
const getToken = () => {
  return localStorage.getItem('token');
};

// Async thunk to fetch relationships
export const fetchRelationships = createAsyncThunk('relationships/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const token = getToken();
    const response = await axios.get(`${BASE_URL}/relationships`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching relationships:', error.response?.data || error.message);
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Async thunk to create a relationship
export const saveRelationship = createAsyncThunk('relationships/create', async (relationship, { rejectWithValue }) => {
  try {
    const token = getToken();
    const relationshipData = { ...relationship, status: relationship.status || 'Active' };

    const response = await axios.post(`${BASE_URL}/relationships/create`, relationshipData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response.data, 'Created Relationship');
    return response.data;
  } catch (error) {
    console.error('Error creating relationship:', error.response?.data || error.message);
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Async thunk to update a relationship
export const updateRelationship = createAsyncThunk('relationships/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const token = getToken();
    const response = await axios.put(`${BASE_URL}/relationships/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response.data, 'Updated Relationship');
    return response.data;
  } catch (error) {
    console.error('Error updating relationship:', error.response?.data || error.message);
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Async thunk to delete a relationship
export const deleteRelationship = createAsyncThunk('relationships/delete', async (id, { rejectWithValue }) => {
  try {
    const token = getToken();
    await axios.delete(`${BASE_URL}/relationships/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Deleted Relationship:', id);
    return id;
  } catch (error) {
    console.error('Error deleting relationship:', error.response?.data || error.message);
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
