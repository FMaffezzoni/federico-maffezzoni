import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Custom domain (federicomaffezzoni.it) is served at the site root.
// The old project path /federico-maffezzoni/ is only used if CUSTOM_DOMAIN=false.
const useCustomDomain = process.env.CUSTOM_DOMAIN !== 'false';
const base =
  process.env.GITHUB_PAGES === 'true' && !useCustomDomain ? '/federico-maffezzoni/' : '/';

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
