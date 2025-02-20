import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Fetch all FAQ Q&As
export const fetchFaqQas = createAsyncThunk(
  'faqQa/findAll',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/faq-qa/findAll`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch FAQ Q&As');
      }

      const data = await response.json();
      console.log('FAQ QAs Response:', data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Create FAQ Q&A
export const createFaqQa = createAsyncThunk(
  'faqQa/create',
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const faqQaData = {
        question: data.question?.trim(),
        answer: data.answer?.trim(),
        categoryFk: parseInt(data.categoryId),
        status: 'Active'
      };

      console.log('Sending FAQ Q&A data:', faqQaData);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/faq-qa/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(faqQaData),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to create FAQ Q&A');
      }

      await dispatch(fetchFaqQas());
      return responseData;
    } catch (error) {
      console.error('Error creating FAQ Q&A:', error);
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Update FAQ Q&A
export const updateFaqQa = createAsyncThunk(
  'faqQa/update',
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const faqQaData = {
        id: id,
        question: data.question?.trim(),
        answer: data.answer?.trim(),
        categoryFk: parseInt(data.categoryId),
        status: 'Active'
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/faq-qa/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(faqQaData),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to update FAQ Q&A');
      }

      await dispatch(fetchFaqQas());
      return responseData;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Delete FAQ Q&A
export const deleteFaqQa = createAsyncThunk(
  'faq-qa/delete',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/faq-qa/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete FAQ Q&A');
      }

      await dispatch(fetchFaqQas());
      return id;
    } catch (error) {
      console.error('Error deleting FAQ Q&A:', error);
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

const faqQaSlice = createSlice({
  name: 'faqQa',
  initialState: {
    items: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFaqQas.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFaqQas.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchFaqQas.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default faqQaSlice.reducer;