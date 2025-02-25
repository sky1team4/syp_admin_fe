import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const fetchBankConfig = createAsyncThunk(
  'bank/fetchConfig',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bank/bank-get`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to fetch configuration');
      }

      const data = await response.json();
      console.log('API Response:', data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

export const saveBankConfig = createAsyncThunk(
  'bank/saveConfig',
  async (data, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bank/bank-create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to save configuration');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

const bankSlice = createSlice({
  name: 'bank',
  initialState: {
    isLoading: false,
    error: null,
    config: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBankConfig.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBankConfig.fulfilled, (state, action) => {
        state.isLoading = false;
        state.config = action.payload;
      })
      .addCase(fetchBankConfig.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(saveBankConfig.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveBankConfig.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(saveBankConfig.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = bankSlice.actions;
export default bankSlice.reducer; 