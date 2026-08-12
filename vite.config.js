import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages project site: https://<user>.github.io/federico-maffezzoni/
const base = process.env.GITHUB_PAGES === 'true' ? '/federico-maffezzoni/' : '/';

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5055',
        changeOrigin: true
      },
      '/uploads': {
        target: 'http://localhost:5055',
        changeOrigin: true
      }
    }
  }
});
