import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    include: ['@emotion/react', '@emotion/styled', '@mui/material/Tooltip'],
  },
  plugins: [
    tsconfigPaths(),
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
  ],
  preview: {
    port: 5000,
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
});
