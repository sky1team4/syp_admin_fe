import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  isLoading: false,
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
      console.log('Fetched sub skills:', data);
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
      const skillId = parseInt(data.skillId);
      
      if (!skillId) {
        throw new Error('Invalid skill ID');
      }

      const subSkillData = {
        name: data.title?.trim(),
        status: 'Active',
        skillId: skillId
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
        throw new Error(responseData.message || `Failed to create sub skill: ${response.statusText}`);
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
      const skillId = parseInt(data.skillId);
      
      if (!skillId) {
        throw new Error('Invalid skill ID');
      }

      const subSkillData = {
        id,
        name: data.title?.trim(),
        status: 'Active',
        skillId: skillId
      };

      console.log('Sending update sub skill data:', subSkillData);

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
        throw new Error(responseData.message || `Failed to update sub skill: ${response.statusText}`);
      }

      await dispatch(fetchSubSkills());
      return responseData;
    } catch (error) {
      console.error('Error updating sub skill:', error);
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
  initialState,
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
      })
      .addCase(saveSubSkill.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveSubSkill.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(saveSubSkill.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateSubSkill.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateSubSkill.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateSubSkill.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteSubSkill.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteSubSkill.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(deleteSubSkill.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default subSkillSlice.reducer;