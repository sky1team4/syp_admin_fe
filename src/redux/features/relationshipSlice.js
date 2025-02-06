import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Function to get the JWT token
const getToken = () => {
  // Replace this with your actual token retrieval logic
  return localStorage.getItem('token');
};

// Async thunks for CRUD operations with JWT token
export const fetchRelationships = createAsyncThunk('relationships/fetchAll', async () => {
  const token = getToken();
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/relationships/findAll`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
});

export const saveRelationship = createAsyncThunk('relationships/save', async (relationship) => {
  const token = getToken();
  console.log('JWT Token:', token); // Log the token to verify it's being retrieved

  // Ensure the relationship object includes a default status of "Active"
  const relationshipData = {
    ...relationship,
    status: relationship.status || 'Active',
  };

  console.log('Relationship Data:', relationshipData); // Log the relationship data to verify its structure
  const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/relationships/create`, relationshipData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
});

export const updateRelationship = createAsyncThunk('relationships/update', async ({ id, data }) => {
  const token = getToken();
  const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/relationships/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,

    },
  });
  return response.data;
});

export const deleteRelationship = createAsyncThunk('relationships/delete', async (id) => {
  const token = getToken();
  await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/relationships/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return id;
});

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
      })
      .addCase(fetchRelationships.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchRelationships.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Handle other CRUD operations similarly
  },
});

export default relationshipSlice.reducer; 