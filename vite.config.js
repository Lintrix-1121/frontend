
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:2090',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  // This ensures environment variables are exposed to the client
  define: {
    'process.env': {}
  }
});