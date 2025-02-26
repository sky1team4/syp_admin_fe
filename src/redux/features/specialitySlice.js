import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Fetch all specialties
export const fetchSpecialties = createAsyncThunk(
  'specialties/findAll',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/specialties/findAll`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch specialties');
      }

      const data = await response.json();
      console.log('API Response:', data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Save specialty
export const saveSpecialty = createAsyncThunk(
  'specialties/save',
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const specialtyData = {
        name: data.title?.trim(),
        status: data.status || 'Active',
        educationId: data.educationId || 1
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/specialties/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(specialtyData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create specialty');
      }

      await dispatch(fetchSpecialties());
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Update specialty
export const updateSpecialty = createAsyncThunk(
  'specialties/update',
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const specialtyData = {
        name: data.title?.trim(),
        status: data.status || 'Active',
        educationId: data.educationId || 1
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/specialties/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(specialtyData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update specialty');
      }

      await dispatch(fetchSpecialties());
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Delete specialty
export const deleteSpecialty = createAsyncThunk(
  'specialties/delete',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/specialties/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete specialty');
      }

      await dispatch(fetchSpecialties());
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

const specialtySlice = createSlice({
  name: 'specialty',
  initialState: {
    items: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    setSpecialties: (state, action) => {
      state.items = action.payload;
      console.log('Setting specialties manually:', action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSpecialties.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        console.log('Fetch pending');
      })
      .addCase(fetchSpecialties.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        console.log('Fetch fulfilled, setting items:', action.payload);
      })
      .addCase(fetchSpecialties.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setSpecialties } = specialtySlice.actions;
export default specialtySlice.reducer;