import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const GetAllbadgeVerificationRequest = createAsyncThunk(
  'badgeVerificationList/badgeVerification',
  async () => {
    const yourToken = Cookies.get('authToken');
    const response = await fetch(`${API_URL}/verification-requests/all`, {
      method: 'POST',
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
    console.log("data badge verification", data)
    console.log("data type:", typeof data)
    console.log("data isArray:", Array.isArray(data))
    return data;
  }
);

export const ChangeBadgeStatus = createAsyncThunk(
  'badgeVerificationList/ChangeBadgeStatus',
  async ({ id }) => {
    console.log("id", id);
    // console.log("badge_status", badge_status);
    
    const yourToken = Cookies.get('authToken');
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/verification-requests/${id}/toggle-status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${yourToken}`,
        'Content-Type': 'application/json',
      },
      // body: JSON.stringify(),
    });
    console.log(response.status);
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
        // Ensure we're setting an array, even if the API returns a different structure
        state.data = Array.isArray(action.payload) ? action.payload : 
                    (action.payload?.data && Array.isArray(action.payload.data)) ? action.payload.data : 
                    (action.payload?.verificationRequests && Array.isArray(action.payload.verificationRequests)) ? action.payload.verificationRequests : [];
      })
      .addCase(GetAllbadgeVerificationRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      }).addCase(ChangeBadgeStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(ChangeBadgeStatus.fulfilled, (state, action) => {
        state.loading = false;
        // Don't overwrite the data array with the response from status change
        // The status change response might not be the full list
        console.log("ChangeBadgeStatus response:", action.payload);
      }).addCase(ChangeBadgeStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default badgeVerificationSlice.reducer;