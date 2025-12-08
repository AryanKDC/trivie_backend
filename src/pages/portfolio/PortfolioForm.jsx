import React, { useState } from 'react';
import { useFormik } from 'formik';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stack,
  Alert,
  Autocomplete,
  Chip,
  Grid,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Swal from 'sweetalert2';
import Loader from '../../components/Loader.jsx';
import { useDispatch } from 'react-redux';
import { addPortfolio, fetchPortfolios } from '../../store/slices/portfolioSlice';
import { useNavigate } from 'react-router-dom';
import paths from '../../routes/paths';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const PortfolioForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const tagsOptions = [
    'Luxury',
    'Residential',
    'Corporate',
    'Office',
    'Hospitality',
    'Data Center',
  ];

  const formik = useFormik({
    initialValues: {
      title: '',
      content: '',
      folder: null,
      tags: [],
      title_one: '',
      description_one: '',
      title_two: '',
      description_two: '',
      title_three: '',
      description_three: '',
    },
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setMessage({ type: '', text: '' });
        const formData = new FormData();
        console.log('Submitting form data...');
        formData.append('page', 'portfolio');
        formData.append('title', values.title);
        formData.append('description', values.content);
        formData.append('title_one', values.title_one);
        formData.append('description_one', values.description_one);
        formData.append('title_two', values.title_two);
        formData.append('description_two', values.description_two);
        formData.append('title_three', values.title_three);
        formData.append('description_three', values.description_three);

        // Append tags
        values.tags.forEach((tag) => {
          formData.append('tags', tag);
        });

        if (values.folder) {
          for (let i = 0; i < values.folder.length; i++) {
            formData.append('images', values.folder[i]);
          }
        }

        const resultAction = await dispatch(addPortfolio(formData));

        if (addPortfolio.fulfilled.match(resultAction)) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Portfolio item added successfully!',
          });
          formik.resetForm();
          formik.setFieldValue('folder', null);
          formik.setFieldValue('tags', []);
          dispatch(fetchPortfolios()); // Refresh list
          navigate(paths.portfolio); // Go back to list after success
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: resultAction.payload?.message || 'Failed to add portfolio item.',
          });
        }
      } catch (error) {
        console.error('Error adding portfolio:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred.',
        });
      } finally {
        setLoading(false);
      }
    },
  });

  const fileInputRef = React.useRef(null);

  React.useEffect(() => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('webkitdirectory', '');
      fileInputRef.current.setAttribute('directory', '');
    }
  }, []);

  const handleFolderChange = (event) => {
    const files = event.currentTarget.files;
    formik.setFieldValue('folder', files);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(paths.portfolio)}
        sx={{ mb: 2 }}
      >
        Back to List
      </Button>
      <Loader open={loading} text="Uploading..." />
      <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
        <Typography variant="h4" gutterBottom>
          Add Portfolio Item
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Add a new portfolio item by uploading a folder of images.
        </Typography>

        {message.text && (
          <Alert severity={message.type} sx={{ mb: 3 }}>
            {message.text}
          </Alert>
        )}

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            {/* Title and Tags Row */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="title"
                name="title"
                label="Title"
                value={formik.values.title}
                onChange={formik.handleChange}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Autocomplete
                multiple
                id="tags-filled"
                options={tagsOptions}
                freeSolo
                forcePopupIcon
                popupIcon={<KeyboardArrowDownIcon sx={{ color: 'black' }} />}
                value={formik.values.tags}
                onChange={(event, newValue) => {
                  formik.setFieldValue('tags', newValue);
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Tags"
                    placeholder="Select tags"
                  />
                )}
              />
            </Grid>

            {/* Detailed Section 1 */}
            <Grid item xs={12}>
              <Typography variant="h6">Detailed Section 1</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                id="title_one"
                name="title_one"
                label="Title One"
                value={formik.values.title_one}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="subtitle2" gutterBottom>
                Description One
              </Typography>
              <ReactQuill
                theme="snow"
                value={formik.values.description_one}
                onChange={(value) => formik.setFieldValue('description_one', value)}
                style={{ height: '150px', marginBottom: '50px' }}
              />
            </Grid>

            {/* Detailed Section 2 */}
            <Grid item xs={12}>
              <Typography variant="h6">Detailed Section 2</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                id="title_two"
                name="title_two"
                label="Title Two"
                value={formik.values.title_two}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="subtitle2" gutterBottom>
                Description Two
              </Typography>
              <ReactQuill
                theme="snow"
                value={formik.values.description_two}
                onChange={(value) => formik.setFieldValue('description_two', value)}
                style={{ height: '150px', marginBottom: '50px' }}
              />
            </Grid>

            {/* Detailed Section 3 */}
            <Grid item xs={12}>
              <Typography variant="h6">Detailed Section 3</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                id="title_three"
                name="title_three"
                label="Title Three"
                value={formik.values.title_three}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="subtitle2" gutterBottom>
                Description Three
              </Typography>
              <ReactQuill
                theme="snow"
                value={formik.values.description_three}
                onChange={(value) => formik.setFieldValue('description_three', value)}
                style={{ height: '150px', marginBottom: '50px' }}
              />
            </Grid>

            {/* Upload Folder */}
            <Grid item xs={12}>
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Upload Folder
                </Typography>
                <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                  Select Folder
                  <input
                    type="file"
                    hidden
                    multiple
                    ref={fileInputRef}
                    onChange={handleFolderChange}
                  />
                </Button>
                {formik.values.folder && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {formik.values.folder.length} files selected
                  </Typography>
                )}
              </Box>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                color="primary"
                variant="contained"
                type="submit"
                size="large"
                sx={{ width: '250px' }}
              >
                Submit Portfolio
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default PortfolioForm;
