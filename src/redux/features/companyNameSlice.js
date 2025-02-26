import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API base URL
const API_URL = process.env.NEXT_PUBLIC_BASE_URL;// Adjust the API endpoint as needed

// Fetch all companies
export const fetchCompanies = createAsyncThunk(
    'companies/findAll',
    async (_, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/company-names/findAll`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'  // Add this header
          },
          body: JSON.stringify({})  // Add empty body
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch companies');
        }
  
        const data = await response.json();
        console.log('API Response:', data);
        return data;
      } catch (error) {
        // Improve error logging
        console.error('Fetch error:', error);
        return rejectWithValue(error.message || 'Network error occurred');
      }
    }
  );

// Save company
export const saveCompany = createAsyncThunk(
  'companies/save',
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const companyData = {
        name: data.title?.trim(),
        status: 'Active',
        // workExpId: 1  // Default workExpId
      };

      console.log('Sending company data:', companyData);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/company-names/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(companyData),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to create company');
      }

      await dispatch(fetchCompanies());
      return responseData;
    } catch (error) {
      console.error('Error creating company:', error);
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Update company
export const updateCompany = createAsyncThunk(
  'companies/update',
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const companyData = {
        id: id,
        name: data.title?.trim(),
        status: 'Active',
        workExpId: 1  // Default workExpId
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/company-names/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(companyData),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to update company');
      }

      await dispatch(fetchCompanies());
      return responseData;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Delete company
export const deleteCompany = createAsyncThunk(
  'companies/delete',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/company-names/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete company');
      }

      await dispatch(fetchCompanies());
      return id;
    } catch (error) {
      console.error('Error deleting company:', error);
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

const companySlice = createSlice({
  name: 'companyName',
  initialState: {
    items: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanies.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(saveCompany.fulfilled, (state, action) => {
        state.items.push(action.payload); // Add the new company name to the state
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        const index = state.items.findIndex(company => company.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload; // Update the company name in the state
        }
      })
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.items = state.items.filter(company => company.id !== action.payload); // Remove the deleted company name
      });
  },
});

export const selectCompanyNames = (state) => state.companyName.items;

export default companySlice.reducer;