import React from 'react';
import { Backdrop, CircularProgress } from '@mui/material';

const Loader = ({ open, text }) => {
  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        flexDirection: 'column',
        gap: 2,
      }}
      open={open}
    >
      <CircularProgress sx={{ color: '#D32F2F' }} />
      {text && (
        <span style={{ marginTop: '10px', fontSize: '1.2rem', fontWeight: '500' }}>{text}</span>
      )}
    </Backdrop>
  );
};

export default Loader;
