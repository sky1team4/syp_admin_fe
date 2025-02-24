import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

export const register = createAsyncThunk('users/register',
  async (credentials) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),

      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Register failed');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }


);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials) => {
    try {
      console.log("credentials", process.env.NEXT_PUBLIC_API_URL);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, {
        // const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get('authToken');
      
      const response = await fetch('http://localhost:8080/users/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      // Remove cookie after successful logout
      Cookies.remove("authToken", { path: "/" });
      
      // Force a page refresh
      window.location.href = '/admin-Login';
      
      return await response.json();
    } catch (error) {
      // Remove cookie even if logout fails
      Cookies.remove("authToken", { path: "/" });
      // Force a page refresh even on error
      window.location.href = '/admin-Login';
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  'users/getAll',
  async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/getAll`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include token for authorization
        },
      });
      // console.log("response status fetchallusers", response.status);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Fetch users failed');
      }

      const data = await response.json();
      // console.log("response.data", data);
      // console.log("data auth users", data);
      return data;
    } catch (error) {
      console.error('Fetch users error:', error);
      throw error;
    }
  }
);

export const BannedUsers = createAsyncThunk(
  'users/getBanned',
  async ({ id, updateUserStatusDto }) => {
    console.log("id", id);
    console.log("updateUserStatusDto", updateUserStatusDto);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/update-status/${id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include token for authorization
        },
        body: JSON.stringify(updateUserStatusDto), // Include the DTO in the request body
      }
    );

    // Ensure the response is checked and parsed correctly
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update user status');
    }

    const data = await response.json(); // Parse the response as JSON
    return data; // Return the parsed data
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    role: null,
    loading: false,
    error: null,
    users: [],
    isAuthenticated: false,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.loading = false;
      state.error = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      Cookies.remove("authToken", { path: "/" });
    },
    resetAuthState: (state) => {
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.access_token;
        
        // Decode token to get role
        try {
          const payload = JSON.parse(atob(action.payload.access_token.split('.')[1]));
          state.role = payload.role;
        } catch (error) {
          console.error('Error decoding token:', error);
        }
        
        localStorage.setItem('token', action.payload.access_token);
        // Store token in a secure, HTTP-only cookie
        Cookies.set("authToken", action.payload.access_token, {
          expires: 1, // 1 day expiration
          path: "/",   // Available site-wide
          secure: true, // Ensures HTTPS usage
          sameSite: "Strict",
        });
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
      })
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Fetch users failed';
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.role = null;
        state.isAuthenticated = false;
        state.loading = false;
        // Reset any other auth-related state
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        // Reset state even if the API call fails
      })
      .addCase(BannedUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(BannedUsers.fulfilled, (state, action) => {
        state.loading = false;
        const userIndex = state.users.findIndex(user => user.id === action.payload.id);
        console.log("userIndex found ==> ", userIndex);
        if (userIndex !== -1) {
          state.users[userIndex].status = 'inactive';
        }
      })
      .addCase(BannedUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { logout, resetAuthState } = authSlice.actions;
export default authSlice.reducer; 