import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

/**
 * @typedef {Object} Domain
 * @property {string} id
 * @property {string} domain_name
 * @property {string} tld
 * @property {number} amount
 * @property {string} currency
 */

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} name
 * @property {string} email
 * @property {string} username
 * @property {number|null} phoneNumber
 * @property {string} status
 */

/**
 * @typedef {Object} RefundRequest
 * @property {string} id - UUID string
 * @property {string} domain_id
 * @property {Domain} domain
 * @property {number} user_id
 * @property {User} user
 * @property {string} type - e.g., "user_initiated"
 * @property {string} status - e.g., "pending", "approved", "rejected"
 * @property {number} requested_amount
 * @property {number|null} refunded_amount
 * @property {string} currency
 * @property {string} reason
 * @property {string|null} admin_notes
 * @property {number|null} processed_by
 * @property {User|null} processedByUser
 * @property {string|null} refund_transaction_id
 * @property {string|null} stripe_refund_id
 * @property {string|null} stripe_refund_status
 * @property {string} created_at - ISO date string
 * @property {string} updated_at - ISO date string
 * @property {string|null} processed_at
 * @property {string|null} approved_at
 * @property {string|null} rejected_at
 */

/**
 * @typedef {RefundRequest[]} RefundRequestsResponse
 */

// Fetch all refund requests
export const fetchRefundRequests = createAsyncThunk(
  'refundRequests/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/domains/refund-requests`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch refund requests');
      }

      const data = await response.json();
      console.log('API Response:', data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Update refund request status
export const updateRefundRequestStatus = createAsyncThunk(
  'refundRequests/updateStatus',
  async ({ id, status, admin_notes }, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/domains/refund-requests/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          status,
          admin_notes: admin_notes || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update refund request status');
      }

      const data = await response.json();
      console.log('Update Status Response:', data);
      
      // Refresh the refund requests list after update
      await dispatch(fetchRefundRequests());
      
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

const refundRequestSlice = createSlice({
  name: 'refundRequest',
  initialState: {
    items: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRefundRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRefundRequests.fulfilled, (state, action) => {
        console.log('Setting state with:', action.payload);
        state.isLoading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchRefundRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.items = [];
      })
      // Update status cases
      .addCase(updateRefundRequestStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateRefundRequestStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update the specific item in the array
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateRefundRequestStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default refundRequestSlice.reducer;

