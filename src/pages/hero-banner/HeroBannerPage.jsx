import React from 'react';
import { useFormik } from 'formik';
import { Box, Button, TextField, Typography, Paper, Stack, Autocomplete } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const pageOptions = [
  { label: 'Home', value: 'home' },
  { label: 'About', value: 'about' },
  { label: 'Process', value: 'process' },
  { label: 'Portfolio', value: 'portfolio' },
  { label: 'Services', value: 'services' },
  { label: 'Contact', value: 'contact' },
];

const HeroBannerPage = () => {
  const formik = useFormik({
    initialValues: {
      page: null,
      title: '',
      subtitle: '',
      description: '',
      images: null,
    },
    onSubmit: (values) => {
      // Extract the value from the page object if it exists
      const submissionData = {
        ...values,
        page: values.page ? values.page.value : null,
      };
      console.log('Hero Banner Form Values:', submissionData);
      alert(JSON.stringify(submissionData, null, 2));
    },
  });

  const handleImageChange = (event) => {
    const files = event.currentTarget.files;
    formik.setFieldValue('images', files);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
        <Typography variant="h4" gutterBottom>
          Hero Banner Module
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Update the hero banner with title, subtitle, description, and multiple images.
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <Stack spacing={3}>
            <Autocomplete
              id="page"
              name="page"
              options={pageOptions}
              getOptionLabel={(option) => option.label}
              value={formik.values.page}
              onChange={(event, newValue) => {
                formik.setFieldValue('page', newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Page"
                  error={formik.touched.page && Boolean(formik.errors.page)}
                  helperText={formik.touched.page && formik.errors.page}
                />
              )}
              fullWidth
              forcePopupIcon
              sx={{
                '& .MuiAutocomplete-popupIndicator': {
                  color: 'black',
                },
                '& .MuiAutocomplete-endAdornment': {
                  top: '50%',
                  transform: 'translateY(-50%)',
                  right: '20px',
                },
              }}
            />

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

            <TextField
              fullWidth
              id="subtitle"
              name="subtitle"
              label="Sub-title"
              value={formik.values.subtitle}
              onChange={formik.handleChange}
              error={formik.touched.subtitle && Boolean(formik.errors.subtitle)}
              helperText={formik.touched.subtitle && formik.errors.subtitle}
            />

            <TextField
              fullWidth
              id="description"
              name="description"
              label="Description"
              multiline
              rows={3}
              value={formik.values.description}
              onChange={formik.handleChange}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
            />

            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Upload Images
              </Typography>
              <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                Select Images
                <input type="file" hidden multiple accept="image/*" onChange={handleImageChange} />
              </Button>
              {formik.values.images && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {formik.values.images.length} files selected
                </Typography>
              )}
            </Box>

            <Button color="primary" variant="contained" fullWidth type="submit" size="large">
              Update Hero Banner
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default HeroBannerPage;
