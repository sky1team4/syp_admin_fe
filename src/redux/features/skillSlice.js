import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Fetch all skills
export const fetchSkills = createAsyncThunk(
  'skills/findAll',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/skills/findAll`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch skills');
      }

      const data = await response.json();
      console.log('API Response:', data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Save skill
export const saveSkill = createAsyncThunk(
  'skills/save',
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const skillData = {
        name: data.title?.trim(),
        status: 'Active',
        image: "https://example.com/javascript-icon.png",
        profileId: 1
      };

      console.log('Sending skill data:', skillData);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/skills/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(skillData),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to create skill');
      }

      await dispatch(fetchSkills());
      return responseData;
    } catch (error) {
      console.error('Error creating skill:', error);
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Update skill
export const updateSkill = createAsyncThunk(
  'skills/update',
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const skillData = {
        id: id,
        name: data.title?.trim(),
        status: 'Active',
        image: "https://example.com/javascript-icon.png",
        profileId: 1
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/skills/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(skillData),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to update skill');
      }

      await dispatch(fetchSkills());
      return responseData;
    } catch (error) {
      console.error('Error updating skill:', error);
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Delete skill
export const deleteSkill = createAsyncThunk(
  'skills/delete',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/skills/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete skill');
      }

      await dispatch(fetchSkills());
      return id;
    } catch (error) {
      console.error('Error deleting skill:', error);
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

const skillSlice = createSlice({
  name: 'skill',
  initialState: {
    items: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSkills.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSkills.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchSkills.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default skillSlice.reducer;