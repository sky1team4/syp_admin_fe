import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

export const register = createAsyncThunk( 'users/register',
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
      // Make sure your NestJS endpoint is set up to clear the cookie
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/logout`, {
        method: 'POST',
        credentials: 'include', // Important: ensures cookies are sent
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include token for authorization  
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Logout failed');
      }

      return await response.json(); // e.g., { message: "Logged out successfully" }
    } catch (error) {
      console.error('Logout error:', error);
      return rejectWithValue(error.message);
    }
  }
)

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
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      localStorage.removeItem('token');
       // Remove authToken cookie
       Cookies.remove("authToken", { path: "/" });
    },
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
        state.role = action.payload.role;
        localStorage.setItem('token', action.payload.access_token);
        // Store token in a secure, HTTP-only cookie
        Cookies.set("authToken", action.payload.access_token, {
          expires: 1, // 1 day expiration
          path: "/",   // Available site-wide
          secure: true, // Ensures HTTPS usage
          sameSite: "Strict",
      });
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
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.loading = false;
        // Clear Redux state
        state.user = null;
        state.token = null;
        state.role = null;
        // Remove from localStorage
        localStorage.removeItem('token');
        // Remove authToken cookie
        Cookies.remove('authToken', { path: '/' });
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Logout failed';
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

export const { logout } = authSlice.actions;
export default authSlice.reducer; 