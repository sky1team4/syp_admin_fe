import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Fetch all employees
export const fetchEmployees = createAsyncThunk(
  'employees/findAll',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employee-managements/findAll`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch employees');
      }

      const data = await response.json();
      console.log('API Response:', data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Save employee
export const saveEmployee = createAsyncThunk(
  'employees/save',
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const employeeData = {
        name: data.title?.trim(),
        status: data.status || 'Active',  // Must be one of: "Active", "Inactive", "On Leave"
        // workExpId: 1  // Default workExpId
      };  

      console.log('Sending employee data:', employeeData);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employee-managements/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(employeeData),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to create employee');
      }

      await dispatch(fetchEmployees());
      return responseData;
    } catch (error) {
      console.error('Error creating employee:', error);
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Update employee
export const updateEmployee = createAsyncThunk(
  'employees/update',
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const employeeData = {
        id: id,
        name: data.title?.trim(),
        status: data.status || 'Active',  // Must be one of: "Active", "Inactive", "On Leave"
        workExpId: 1  // Default workExpId
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employee-managements/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(employeeData),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to update employee');
      }

      await dispatch(fetchEmployees());
      return responseData;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Delete employee
export const deleteEmployee = createAsyncThunk(
  'employees/delete',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employee-managements/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete employee');
      }

      await dispatch(fetchEmployees());
      return id;
    } catch (error) {
      console.error('Error deleting employee:', error);
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

const employeeSlice = createSlice({
  name: 'employee',
  initialState: {
    items: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default employeeSlice.reducer;