import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  items: [],
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  },
  filters: {
    title: '',
    page: '',
    tags: '',
  },
  search: '',
  tags: [], // Available tags for autocomplete
  sort: {
    key: 'createdAt',
    direction: 'desc',
  },
};

export const fetchTags = createAsyncThunk('portfolio/fetchTags', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL || 'http://localhost:2000/api/v1'}/portfolio/tags`,
    );
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to fetch tags');
  }
});

export const fetchPortfolios = createAsyncThunk(
  'portfolio/fetchPortfolios',
  async (_, { getState }) => {
    const { pagination, search, sort, filters } = getState().portfolio;

    // Query params for pagination and sorting
    const params = {
      page: pagination.page,
      limit: pagination.limit,
      sortBy: sort.key,
      sort: sort.direction,
      sortBy: sort.key,
      sort: sort.direction,
      search: typeof search === 'string' ? search : '', // Global search, ensure strictly string
    };

    // Body for dynamic filters
    const body = {
      filter: {},
    };

    // Map filters to body
    if (filters.title) body.filter.title = filters.title;
    if (filters.page) body.filter.page = filters.page;
    if (filters.tags) {
      // Split tags by comma and trim
      body.filter.tags = filters.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag);
    }

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL || 'http://localhost:2000/api/v1'}/portfolio/get`,
      body,
      { params },
    );
    return response.data;
  },
);

export const addPortfolio = createAsyncThunk(
  'portfolio/addPortfolio',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:2000/api/v1'}/portfolio/add`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
      state.pagination.page = 1; // Reset page on search
    },
    setFilter: (state, action) => {
      const { key, value } = action.payload;
      state.filters[key] = value;
      state.pagination.page = 1; // Reset page on filter
    },
    setSort: (state, action) => {
      const { key } = action.payload;
      if (state.sort.key === key) {
        state.sort.direction = state.sort.direction === 'asc' ? 'desc' : 'asc';
      } else {
        state.sort.key = key;
        state.sort.direction = 'asc';
      }
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    resetState: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPortfolios.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPortfolios.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.data;
        if (action.payload.pagination) {
          state.pagination.total = action.payload.pagination.total;
          state.pagination.totalPages = action.payload.pagination.totalPages;
          state.pagination.limit = action.payload.pagination.limit;
        }
      })
      .addCase(fetchPortfolios.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.tags = action.payload;
      })
      .addCase(addPortfolio.fulfilled, (state, action) => {
        // Optionally refresh list or handle success
      });
  },
});

export const { setSearch, setFilter, setSort, setPage, resetState } = portfolioSlice.actions;

export default portfolioSlice.reducer;
