import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Example async function to fetch degree data (replace with your actual data fetching logic)
export const fetchDegrees = createAsyncThunk('degrees/findAll', async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/degrees/findAll`, {
    method: 'POST',
  });
  console.log(response.status);

  return response.json();
});

// New async functions for create, update, and delete
export const createDegree = createAsyncThunk('degrees/create', async (degree) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/degrees/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(degree),
  });
  return response.json();
});

export const updateDegree = createAsyncThunk('degrees/update', async ({ id, degree }) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/degrees/update/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(degree),
  });
  return response.json();
});

export const deleteDegree = createAsyncThunk('degrees/delete', async (id) => {
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/degrees/delete/${id}`, {
    method: 'POST',
  });
  return id; // Return the id of the deleted degree
});

const degreeSlice = createSlice({
  name: 'degrees',
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDegrees.fulfilled, (state, action) => {
        return action.payload; // Set the state to the fetched degrees
      })
      .addCase(createDegree.fulfilled, (state, action) => {
        state.push(action.payload); // Add the new degree to the state
      })
      .addCase(updateDegree.fulfilled, (state, action) => {
        const index = state.findIndex(degree => degree.id === action.payload.id);
        if (index !== -1) {
          state[index] = action.payload; // Update the degree in the state
        }
      })
      .addCase(deleteDegree.fulfilled, (state, action) => {
        return state.filter(degree => degree.id !== action.payload); // Remove the deleted degree from the state
      });
  },
});

// Export the async actions
export { fetchDegrees, createDegree, updateDegree, deleteDegree };

// Export the reducer to be used in the store
export default degreeSlice.reducer;