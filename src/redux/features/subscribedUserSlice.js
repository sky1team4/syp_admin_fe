import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ;
// const API_BASE_URL = "http://localhost:8080";
console.log("API_BASE_URL", API_BASE_URL);

export const fetchSubscribedUsers = createAsyncThunk(
    'subscribedUser/fetchSubscribedUsers',
    async () => {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/subscribed-users/all`, {
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
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_BASE_URL}/subscribed-users/create`, userData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    }
);

export const updateSubscribedUser = createAsyncThunk(
    'subscribedUser/updateSubscribedUser',
    async ({ id, userData }) => {
        const token = localStorage.getItem('token');
        const response = await axios.patch(`${API_BASE_URL}/subscribed-users/${id}`, userData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    }
);

export const deleteSubscribedUser = createAsyncThunk(
    'subscribedUser/deleteSubscribedUser',
    async (id) => {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_BASE_URL}/subscribed-users/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return id; // Return the id for the reducer to remove the user from the state
    }
);

export const getSubscriptionStats = createAsyncThunk(
    'subscribedUser/getSubscriptionStats',
    async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error("Token is not available");
        }
        const response = await axios.get(`${API_BASE_URL}/subscribed-users/subscription-stats`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    }
);

const subscribedUserSlice = createSlice({
    name: 'subscribedUser',
    initialState: {
        users: [],
        subscriptionStats: {}, // Ensure this is initialized
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
            })
            .addCase(getSubscriptionStats.pending, (state) => {
                state.loading = true;
            })
            .addCase(getSubscriptionStats.fulfilled, (state, action) => {
                state.loading = false;
                state.subscriptionStats = action.payload; // Ensure this line is present
            })
            .addCase(getSubscriptionStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { clearError } = subscribedUserSlice.actions;
export default subscribedUserSlice.reducer; 