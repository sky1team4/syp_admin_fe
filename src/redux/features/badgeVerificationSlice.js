import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const GetAllbadgeVerificationRequest = createAsyncThunk(
  'badgeVerificationList/badgeVerification',
  async () => {
    const yourToken = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/Badge-verification`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${yourToken}`,
        'Content-Type': 'application/json',
      },
    });
    console.log("response badge verification", response.status)
console.log("response badge verification", response)
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Badge-verification/${id}`, {
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
      .addCase(GetAllbadgeVerificationRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetAllbadgeVerificationRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(GetAllbadgeVerificationRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      }).addCase(ChangeBadgeStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(ChangeBadgeStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      }).addCase(ChangeBadgeStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default badgeVerificationSlice.reducer;