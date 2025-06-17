import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';
import { disconnectSocket } from '@/utils/socket';
import { restartTokenMonitorIfNeeded } from '@/hooks/useNotifications';

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
        // const response = await fetch(${API_URL}/users/login, {
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

      // Disconnect socket before logout
      disconnectSocket();

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/logout`, {
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
      // Disconnect socket even on error
      disconnectSocket();
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
          'Authorization': `Bearer ${Cookies.get('authToken')}`, // Include token for authorization
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
          'Authorization': `Bearer ${Cookies.get('authToken')}`, // Include token for authorization
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

export const updateUser = createAsyncThunk(
  'auth/update',
  async (updateData, { getState }) => {
    try {
      const token = Cookies.get('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData),
      });
      console.log("response", response);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Update failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Update error:', error);
      throw error;
    }
  }
);

export const verifyPassword = createAsyncThunk(
  'auth/verifyPassword',
  async (currentPassword, { rejectWithValue }) => {
    try {
      const token = Cookies.get('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/verify-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password: currentPassword }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Password verification failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Password verification error:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({newPassword}, { rejectWithValue }) => {
    const token = Cookies.get('authToken');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ token, newPassword }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Password reset failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Password reset error:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const updateProfileImage = createAsyncThunk(
  'auth/updateProfileImage',
  async (file, { rejectWithValue }) => {
    try {
      const token = Cookies.get('authToken');
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/upload-profile-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload image');
      }

      const data = await response.json();
      // console.log('Upload response:', data); // Debug log

      if (!data.imageUrl) {
        throw new Error('No image URL in response');
      }

      return data;
    } catch (error) {
      console.error('Profile image upload error:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Function to decode token and get user data
const getInitialUserState = () => {
  try {
    const token = Cookies.get('authToken');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Initial token payload:', payload);

      // Check if token is expired (but be more lenient during initialization)
      const currentTime = Date.now() / 1000;
      if (payload.exp && payload.exp < currentTime) {
        console.warn('Token expired during initialization');
        // Don't immediately remove token - let AuthGuard handle this
        console.log('⚠️ Expired token found but not removing (AuthGuard will handle)');
        // Cookies.remove("authToken", { path: "/" });
        // localStorage.removeItem('token');
        // return null;
      }

      // Get profile picture from localStorage
      const profilePicture = localStorage.getItem('userProfilePicture');
      console.log('Stored profile picture:', profilePicture);

      return {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        profilePicture: profilePicture // Use stored profile picture
      };
    }
  } catch (error) {
    console.error('Error getting initial user state:', error);
    // Don't automatically clear invalid tokens during initialization
    console.log('⚠️ Token decode error during init but not removing (AuthGuard will handle)');
    // Cookies.remove("authToken", { path: "/" });
    // localStorage.removeItem('token');
  }
  return null;
};

// Function to get initial role
const getInitialRole = () => {
  try {
    const token = Cookies.get('authToken');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Extracting role from token:', payload.role);
      return payload.role;
    }
  } catch (error) {
    console.error('Error getting initial role:', error);
  }
  return null;
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: getInitialUserState(),
    token: Cookies.get('authToken') || null,
    role: getInitialRole(), // Extract role from token
    loading: false,
    error: null,
    users: [],
    isAuthenticated: !!Cookies.get('authToken'),
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
      // Disconnect socket on manual logout
      disconnectSocket();
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

        try {
          const payload = JSON.parse(atob(action.payload.access_token.split('.')[1]));
          console.log('Login payload:', payload);

          // Get profile image from the response or existing storage
          const profileImage = action.payload.profileImage || localStorage.getItem('userProfilePicture');

          state.role = payload.role;
          state.user = {
            id: payload.sub,
            name: payload.name,
            email: payload.email,
            profilePicture: profileImage
          };

          // Store the profile image URL if it exists
          if (profileImage) {
            localStorage.setItem('userProfilePicture', profileImage);
          }

          state.isAuthenticated = true;

          Cookies.set("authToken", action.payload.access_token, {
            expires: 1,
            path: "/",
            secure: true,
            sameSite: "Strict",
          });

          console.log('Updated user state:', state.user); // Debug log
        } catch (error) {
          console.error('Error decoding token:', error);
        }

        localStorage.setItem('token', action.payload.access_token);
        
        // Restart token monitor after successful login
        setTimeout(() => {
          try {
            restartTokenMonitorIfNeeded();
            console.log('🔄 Token monitor restarted after login');
          } catch (error) {
            console.warn('Failed to restart token monitor:', error);
          }
        }, 1000);
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
        // Clear stored profile picture
        localStorage.removeItem('userProfilePicture');
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
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload.token) {
          state.token = action.payload.token;

          // Update stored token
          Cookies.set("authToken", action.payload.token, {
            expires: 1,
            path: "/",
            secure: true,
            sameSite: "Strict",
          });

          // Update user info while preserving profile picture
          try {
            const payload = JSON.parse(atob(action.payload.token.split('.')[1]));
            const currentProfilePicture = state.user?.profilePicture;

            state.user = {
              ...state.user,
              name: payload.name,
              email: payload.email,
              profilePicture: currentProfilePicture // Preserve current profile picture
            };
          } catch (error) {
            console.error('Error decoding updated token:', error);
          }
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateProfileImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfileImage.fulfilled, (state, action) => {
        state.loading = false;
        console.log('Update profile image response:', action.payload);

        if (state.user && action.payload.imageUrl) {
          state.user = {
            ...state.user,
            profilePicture: action.payload.imageUrl
          };
          // Store in localStorage
          localStorage.setItem('userProfilePicture', action.payload.imageUrl);
        }
      })
      .addCase(updateProfileImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update profile picture';
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to reset password';
      });
  },
});

export const { logout, resetAuthState } = authSlice.actions;
export default authSlice.reducer;