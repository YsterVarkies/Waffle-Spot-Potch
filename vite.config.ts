import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  base: '/Waffle-Spot-Potch/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // Three.js lives in its own lazily loaded chunk (the 3D waffle), fetched only when that section nears the screen.
    chunkSizeWarningLimit: 1400,

  },
});
