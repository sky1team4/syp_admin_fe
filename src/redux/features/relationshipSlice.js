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
export const saveRelationship = createAsyncThunk('relationships/create', async (relationship, { dispatch, rejectWithValue }) => {
  try {
    const token = getToken();
    const relationshipData = { ...relationship, status: relationship.status || 'Active' };

    const response = await axios.post(`${BASE_URL}/relationships/create`, relationshipData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    await dispatch(fetchRelationships()); // Refresh data after creation
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Async thunk to update a relationship
export const updateRelationship = createAsyncThunk('relationships/update', async ({ id, data }, { dispatch, rejectWithValue }) => {
  try {
    const token = getToken();
    const response = await axios.post(`${BASE_URL}/relationships/${id}/update`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    await dispatch(fetchRelationships()); // Refresh data after update
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Async thunk to delete a relationship
export const deleteRelationship = createAsyncThunk('relationships/delete', async (id, { dispatch, rejectWithValue }) => {
  try {
    const token = getToken();
    await axios.post(`${BASE_URL}/relationships/${id}/delete`, {}, {
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
