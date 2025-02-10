import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchSubscriptionVerification = createAsyncThunk(
  'subscription/fetchSubscriptionVerification',
  async () => {
    const yourToken = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/subscription-verification`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${yourToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  }
);

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscriptionVerification.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSubscriptionVerification.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchSubscriptionVerification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default subscriptionSlice.reducer;