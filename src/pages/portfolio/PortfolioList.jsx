import React, { useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Stack,
  Pagination,
  Chip,
  IconButton,
  InputAdornment,
  Autocomplete,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ClearIcon from '@mui/icons-material/Clear';
import FilterListIcon from '@mui/icons-material/FilterList';
import Loader from '../../components/Loader.jsx';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPortfolios,
  fetchTags,
  setSearch,
  setFilter,
  setSort,
  setPage,
} from '../../store/slices/portfolioSlice';
import { useNavigate } from 'react-router-dom';
import paths from '../../routes/paths';

// Simple debounce implementation
function debounce(func, wait) {
  let timeout;
  const debounced = function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
  debounced.cancel = () => {
    clearTimeout(timeout);
  };
  return debounced;
}

const PortfolioList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, status, pagination, filters, search, sort, tags } = useSelector(
    (state) => state.portfolio,
  );

  const loading = status === 'loading';

  useEffect(() => {
    dispatch(fetchTags());
  }, [dispatch]);

  // Debounced fetch
  const debouncedFetch = useCallback(
    debounce(() => {
      dispatch(fetchPortfolios());
    }, 500),
    [dispatch],
  );

  // Trigger fetch when search/filters/sort/page change
  useEffect(() => {
    debouncedFetch();
    return () => debouncedFetch.cancel();
  }, [search, filters, sort, pagination.page, debouncedFetch]);

  const handlePageChange = (event, value) => {
    dispatch(setPage(value));
  };

  const handleSort = (key) => {
    dispatch(setSort({ key }));
  };

  const handleFilterChange = (key, value) => {
    dispatch(setFilter({ key, value }));
  };

  const handleSearchChange = (e) => {
    dispatch(setSearch(e.target.value));
  };

  const renderSortIcon = (columnKey) => {
    if (sort.key !== columnKey) return <FilterListIcon fontSize="small" sx={{ color: 'black' }} />;
    return sort.direction === 'asc' ? (
      <ArrowUpwardIcon fontSize="small" sx={{ color: 'black' }} />
    ) : (
      <ArrowDownwardIcon fontSize="small" sx={{ color: 'black' }} />
    );
  };

  return (
    <Box sx={{ p: 3, width: '100%' }}>
      <Loader open={loading} text="Loading..." />
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Portfolio List</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate(paths.portfolioAdd)}
        >
          Add Portfolio
        </Button>
      </Stack>

      {/* <Paper sx={{ p: 2, mb: 3, width: '100%' }}>
        <TextField
          fullWidth
          label="Global Search"
          variant="outlined"
          size="small"
          value={search}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper> */}

      <TableContainer component={Paper} sx={{ width: '100%' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography
                    variant="subtitle2"
                    onClick={() => handleSort('title')}
                    sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Project Name
                  </Typography>
                  <IconButton size="small" onClick={() => handleSort('title')}>
                    {renderSortIcon('title')}
                  </IconButton>
                </Stack>
                <TextField
                  variant="standard"
                  placeholder="Search Project Name"
                  size="small"
                  value={filters.title}
                  onChange={(e) => handleFilterChange('title', e.target.value)}
                  sx={{ mt: 1, width: '100%' }}
                />
              </TableCell>
              <TableCell>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography
                    variant="subtitle2"
                    onClick={() => handleSort('page')}
                    sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Page
                  </Typography>
                  <IconButton size="small" onClick={() => handleSort('page')}>
                    {renderSortIcon('page')}
                  </IconButton>
                </Stack>
                <TextField
                  variant="standard"
                  placeholder="Search Page"
                  size="small"
                  value={filters.page}
                  onChange={(e) => handleFilterChange('page', e.target.value)}
                  sx={{ mt: 1, width: '100%' }}
                />
              </TableCell>
              <TableCell sx={{ minWidth: '200px' }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    Tags
                  </Typography>
                </Stack>
                <Autocomplete
                  freeSolo
                  forcePopupIcon
                  sx={{
                    '& .MuiAutocomplete-popupIndicator': {
                      transform: 'translateY(-3px)',
                    },
                    '& .MuiAutocomplete-clearIndicator': {
                      transform: 'translateY(-3px)',
                    },
                  }}
                  popupIcon={<KeyboardArrowDownIcon sx={{ color: 'black' }} />}
                  clearIcon={filters.tags ? <ClearIcon sx={{ color: 'black' }} /> : null}
                  options={tags || []}
                  value={filters.tags || ''}
                  onChange={(event, newValue) => {
                    handleFilterChange('tags', newValue);
                  }}
                  onInputChange={(event, newInputValue) => {
                    handleFilterChange('tags', newInputValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      placeholder="Search Tags"
                      size="small"
                      sx={{ mt: 1, width: '100%' }}
                    />
                  )}
                />
              </TableCell>
              <TableCell sx={{ verticalAlign: 'top' }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography
                    variant="subtitle2"
                    onClick={() => handleSort('createdAt')}
                    sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Created At
                  </Typography>
                  <IconButton size="small" onClick={() => handleSort('createdAt')}>
                    {renderSortIcon('createdAt')}
                  </IconButton>
                </Stack>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.page}</TableCell>
                <TableCell>
                  {item.tags &&
                    item.tags.map((tag, index) => (
                      <Chip key={index} label={tag} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                    ))}
                </TableCell>
                <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
            {items.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No portfolio items found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack alignItems="center" mt={3}>
        <Pagination
          count={pagination.totalPages}
          page={pagination.page}
          onChange={handlePageChange}
          color="primary"
        />
      </Stack>
    </Box>
  );
};

export default PortfolioList;
