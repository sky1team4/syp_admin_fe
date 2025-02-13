import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Fetch all RSS feeds
export const fetchRssFeeds = createAsyncThunk(
  'rssFeeds/findAll',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rss-feeds/findAll`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch RSS feeds');
      }

      const data = await response.json();
      console.log('API Response:', data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Save RSS feed
export const saveRssFeed = createAsyncThunk(
  'rssFeeds/save',
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const rssFeedData = {
        name: data.title?.trim(),
        status: 'Active'
      };

      console.log('Sending RSS feed data:', rssFeedData);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rss-feeds/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(rssFeedData),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to create RSS feed');
      }

      await dispatch(fetchRssFeeds());
      return responseData;
    } catch (error) {
      console.error('Error creating RSS feed:', error);
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Update RSS feed
export const updateRssFeed = createAsyncThunk(
  'rssFeeds/update',
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const rssFeedData = {
        id: id,
        name: data.title?.trim(),
        status: 'Active'
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rss-feeds/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(rssFeedData),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to update RSS feed');
      }

      await dispatch(fetchRssFeeds());
      return responseData;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

// Delete RSS feed
export const deleteRssFeed = createAsyncThunk(
  'rssFeeds/delete',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rss-feeds/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete RSS feed');
      }

      await dispatch(fetchRssFeeds());
      return id;
    } catch (error) {
      console.error('Error deleting RSS feed:', error);
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

const rssFeedSlice = createSlice({
  name: 'rssFeed',
  initialState: {
    items: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRssFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRssFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchRssFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default rssFeedSlice.reducer;