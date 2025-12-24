import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

/**
 * @typedef {Object} AddressMailing
 * @property {string} address1
 * @property {string} city
 * @property {string} country
 * @property {string} postalCode
 * @property {string} state
 */

/**
 * @typedef {Object} ContactInfo
 * @property {AddressMailing} addressMailing
 * @property {string} email
 * @property {string} nameFirst
 * @property {string} nameLast
 */

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} name
 * @property {string} email
 * @property {string} username
 * @property {number} phoneNumber
 * @property {string} status
 */

/**
 * @typedef {Object} RefundRequest
 * @property {string} id - UUID string
 * @property {string} status - e.g., "pending", "approved", "rejected"
 * @property {number} requested_amount
 * @property {number|null} refunded_amount
 * @property {string} created_at - ISO date string
 */

/**
 * @typedef {Object} Domain
 * @property {string} id - UUID string
 * @property {number} user_id
 * @property {User} user
 * @property {string} domain_name
 * @property {string} tld
 * @property {number} registration_years
 * @property {number} amount
 * @property {string} currency
 * @property {string|null} stripe_payment_intent_id
 * @property {string|null} stripe_charge_id
 * @property {string|null} stripe_refund_id
 * @property {string|null} godaddy_order_id
 * @property {string} godaddy_status
 * @property {string} status
 * @property {boolean} is_verified
 * @property {string|null} failure_reason
 * @property {ContactInfo} contact_info
 * @property {string} created_at - ISO date string
 * @property {string} updated_at - ISO date string
 * @property {RefundRequest|null} refundRequest
 */

/**
 * @typedef {Domain[]} DomainsResponse
 */

// Fetch all domains
export const fetchDomains = createAsyncThunk(
  'domains/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/domains`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch domains');
      }

      const data = await response.json();
      console.log('API Response:', data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

const domainSlice = createSlice({
  name: 'domain',
  initialState: {
    items: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDomains.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDomains.fulfilled, (state, action) => {
        console.log('Setting state with:', action.payload);
        state.isLoading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchDomains.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.items = [];
      });
  },
});

export default domainSlice.reducer;