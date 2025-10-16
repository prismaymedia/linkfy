/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal';
import tailwindcss from '@tailwindcss/vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../shared'),
      '@assets': path.resolve(__dirname, '../attached_assets'),
    },
  },
  build: {
    outDir: 'dist',
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-hook-form'],
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select'],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-supabase': ['@supabase/supabase-js'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    fs: {
      strict: true,
      deny: ['**/.*'],
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/lib/test/setupTests.tsx',
  },
});
