import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Fetch all modules
export const fetchModules = createAsyncThunk(
  'modules/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_URL}/modules`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch modules');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Fetch active modules
export const fetchActiveModules = createAsyncThunk(
  'modules/fetchActive',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_URL}/modules/active`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch active modules');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Note: Create module functionality removed - only edit and delete allowed

// Update a module
export const updateModule = createAsyncThunk(
  'modules/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Only include fields that are provided (all fields are optional)
      const moduleData = {};
      if (data.name !== undefined) moduleData.name = data.name;
      if (data.description !== undefined) moduleData.description = data.description;
      if (data.status !== undefined) moduleData.status = data.status;
      if (data.isActive !== undefined) moduleData.isActive = data.isActive;

      const response = await fetch(`${API_URL}/modules/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(moduleData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update module');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Delete a module
export const deleteModule = createAsyncThunk(
  'modules/delete',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_URL}/modules/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete module');
      }

      return { id };
    } catch (error) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

const modulesSlice = createSlice({
  name: 'modules',
  initialState: {
    isLoading: false,
    error: null,
    modules: [],
    activeModules: [],
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch modules
      .addCase(fetchModules.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchModules.fulfilled, (state, action) => {
        state.isLoading = false;
        state.modules = action.payload;
        state.error = null;
      })
      .addCase(fetchModules.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch active modules
      .addCase(fetchActiveModules.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchActiveModules.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeModules = action.payload;
        state.error = null;
      })
      .addCase(fetchActiveModules.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create module functionality removed
      // Update module
      .addCase(updateModule.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateModule.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.modules.findIndex(module => module.id === action.payload.id);
        if (index !== -1) {
          state.modules[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateModule.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete module
      .addCase(deleteModule.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteModule.fulfilled, (state, action) => {
        state.isLoading = false;
        state.modules = state.modules.filter(module => module.id !== action.payload.id);
        state.error = null;
      })
      .addCase(deleteModule.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = modulesSlice.actions;
export default modulesSlice.reducer;
