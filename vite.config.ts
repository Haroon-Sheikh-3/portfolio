import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
  plugins: [react(), glsl()],
  resolve: {
    alias: {
      '@': '/src',
      '@scene': '/src/scene',
      '@shaders': '/src/shaders',
      '@motion': '/src/motion',
      '@state': '/src/state',
      '@content': '/src/content',
      '@components': '/src/components',
      '@sections': '/src/sections',
    },
  },
  build: {
    target: 'es2020',
    modulePreload: { polyfill: true },
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('three') || id.includes('@react-three/fiber') || id.includes('@react-three/drei')) {
            return 'three';
          }
          if (id.includes('gsap') || id.includes('lenis')) {
            return 'motion';
          }
          if (id.includes('react')) {
            return 'react';
          }
        },
      },
    },
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
  preview: {
    host: '127.0.0.1',
    port: 4173,
  },
});