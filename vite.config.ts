import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/Jalin-Belajar/',
  server: {
    port: 3000,
    open: false
  }
});

