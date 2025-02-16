import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch user data
export const fetchUsers = createAsyncThunk('users/register', async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  console.log(response.json());
  return response.json();
});

export const createUser = createAsyncThunk('users/create', async (userData) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  return response.json();
});

const userSlice = createSlice({
  name: 'users',
  initialState: {
    data: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.data = action.payload;
      });
    builder
      .addCase(createUser.fulfilled, (state, action) => {
        state.data.push(action.payload);
      });
  },
});

export const selectUsers = (state) => state.users.data;

export default userSlice.reducer; 