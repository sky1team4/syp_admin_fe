import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  error: null,
};

// Fetch all sub skills
export const fetchSubSkills = createAsyncThunk(
  'subSkills/findAll',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sub-skills/findAll`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch sub skills');
      }

      const data = await response.json();
      console.log('API Response:', data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Save sub skill
export const saveSubSkill = createAsyncThunk(
  'subSkills/save',
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const subSkillData = {
        name: data.title?.trim(),
        status: 'Active',
        skillId: parseInt(data.skillId)  // Use the selected skillId
      };

      console.log('Sending sub skill data:', subSkillData);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sub-skills/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(subSkillData),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to create sub skill');
      }

      await dispatch(fetchSubSkills());
      return responseData;
    } catch (error) {
      console.error('Error creating sub skill:', error);
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Update sub skill
export const updateSubSkill = createAsyncThunk(
  'subSkills/update',
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const subSkillData = {
        id: id,
        name: data.title?.trim(),
        status: 'Active',
        skillId: parseInt(data.skillId)  // Use the selected skillId
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sub-skills/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(subSkillData),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to update sub skill');
      }

      await dispatch(fetchSubSkills());
      return responseData;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Delete sub skill
export const deleteSubSkill = createAsyncThunk(
  'subSkills/delete',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sub-skills/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete sub skill');
      }

      await dispatch(fetchSubSkills());
      return id;
    } catch (error) {
      console.error('Error deleting sub skill:', error);
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

const subSkillSlice = createSlice({
  name: 'subSkill',
  initialState: {
    items: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubSkills.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSubSkills.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchSubSkills.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default subSkillSlice.reducer;