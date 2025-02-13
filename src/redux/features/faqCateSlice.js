import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Fetch all FAQ categories
export const fetchFaqCategories = createAsyncThunk(
  'faqCategories/findAll',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/faq-categories/findAll`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch FAQ categories');
      }

      const data = await response.json();
      console.log('API Response:', data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Save FAQ category
export const saveFaqCategory = createAsyncThunk(
  'faqCategories/save',
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const faqCategoryData = {
        name: data.title?.trim(),
        status: 'Active'
      };

      console.log('Sending FAQ category data:', faqCategoryData);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/faq-categories/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(faqCategoryData),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to create FAQ category');
      }

      await dispatch(fetchFaqCategories());
      return responseData;
    } catch (error) {
      console.error('Error creating FAQ category:', error);
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Update FAQ category
export const updateFaqCategory = createAsyncThunk(
  'faqCategories/update',
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const faqCategoryData = {
        id: id,
        name: data.title?.trim(),
        status: 'Active'
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/faq-categories/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(faqCategoryData),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to update FAQ category');
      }

      await dispatch(fetchFaqCategories());
      return responseData;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Delete FAQ category
export const deleteFaqCategory = createAsyncThunk(
  'faqCategories/delete',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/faq-categories/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete FAQ category');
      }

      await dispatch(fetchFaqCategories());
      return id;
    } catch (error) {
      console.error('Error deleting FAQ category:', error);
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

const faqCategorySlice = createSlice({
  name: 'faqCategory',
  initialState: {
    items: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFaqCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFaqCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchFaqCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default faqCategorySlice.reducer;