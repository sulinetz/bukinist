import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Важно для GitHub Pages: используем относительные пути ('./'), 
  // чтобы сайт работал и в корне домена, и в подпапке (например, /my-repo/).
  base: './', 
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});