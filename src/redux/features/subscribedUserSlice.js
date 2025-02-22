import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export const fetchSubscribedUsers = createAsyncThunk(
    'subscribedUser/fetchSubscribedUsers',
    async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/subscribed-users`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    }
);

export const createSubscribedUser = createAsyncThunk(
    'subscribedUser/createSubscribedUser',
    async (userData) => {
        const response = await axios.post(`${API_BASE_URL}/subscribed-users`, userData);
        return response.data;
    }
);

export const updateSubscribedUser = createAsyncThunk(
    'subscribedUser/updateSubscribedUser',
    async ({ id, userData }) => {
        const response = await axios.patch(`${API_BASE_URL}/subscribed-users/${id}`, userData);
        return response.data;
    }
);

export const deleteSubscribedUser = createAsyncThunk(
    'subscribedUser/deleteSubscribedUser',
    async (id) => {
        await axios.delete(`${API_BASE_URL}/subscribed-users/${id}`);
        return id; // Return the id for the reducer to remove the user from the state
    }
);

export const getAllMonthlySubscribedUser = createAsyncThunk(
    'subscribedUser/getAllMonthlySubscribedUser',
    async () => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/subscribed-users/count/monthly`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        console.log("Monthly Subscribed Response", data);
        console.log("Monthly Subscribed Response Status", response.status);
        return data;
    }
);

export const getAllAnnualSubscribedUser = createAsyncThunk(
    'subscribedUser/getAllAnnualSubscribedUser',
    async () => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/subscribed-users/count/annual`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        console.log("Annual Subscribed Response", data);
        console.log("Annual Subscribed Response Status", response.status);
        return data;
    }
);

const subscribedUserSlice = createSlice({
    name: 'subscribedUser',
    initialState: {
        users: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSubscribedUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSubscribedUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchSubscribedUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createSubscribedUser.fulfilled, (state, action) => {
                state.users.push(action.payload);
            })
            .addCase(updateSubscribedUser.fulfilled, (state, action) => {
                const index = state.users.findIndex(user => user.id === action.payload.id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
            })
            .addCase(deleteSubscribedUser.fulfilled, (state, action) => {
                state.users = state.users.filter(user => user.id !== action.payload);
            }).addCase(getAllMonthlySubscribedUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            }).addCase(getAllMonthlySubscribedUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            }).addCase(getAllMonthlySubscribedUser.pending, (state) => {
                state.loading = true;
            }).addCase(getAllAnnualSubscribedUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            }).addCase(getAllAnnualSubscribedUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            }).addCase(getAllAnnualSubscribedUser.pending, (state) => {
                state.loading = true;
            });
    },
});

export const { clearError } = subscribedUserSlice.actions;
export default subscribedUserSlice.reducer; 