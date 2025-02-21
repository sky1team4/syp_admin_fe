import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const badgeVerification = createAsyncThunk(
  'badgeVerificationList/badgeVerification',
  async () => {
    const yourToken = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/badge-verification`, {
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

export const ChangeBadgeStatus = createAsyncThunk(
  'badgeVerificationList/ChangeBadgeStatus',
  async ({ id, badge_status }) => {
    const yourToken = localStorage.getItem('token');
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/badge-verification/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${yourToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ badge_status }),
    });
    console.log(response.status)
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  }
);

const badgeVerificationSlice = createSlice({
  name: 'badgeVerificationList',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(badgeVerification.pending, (state) => {
        state.loading = true;
      })
      .addCase(badgeVerification.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(badgeVerification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default badgeVerificationSlice.reducer;