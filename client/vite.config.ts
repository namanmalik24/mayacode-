import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  base: '/dashboard/',
  server: {
    host: '0.0.0.0',  // Allow access from any IP, not just localhost
    port: 3002,
    strictPort: true,
    allowedHosts: ['test.mayacode.io'],      // Enable CORS for cross-domain requests
    proxy: {
      '/dash': {
        target: 'https://test.mayacode.io',
        changeOrigin: true,
        secure: false,
      },
    },
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 3002,
      path: '/ws',
    },
  },
});