import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal';
import tailwindcss from '@tailwindcss/vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(async () => ({
  base: process.env.NODE_ENV === 'production' ? '/linkfy/' : '/',
  plugins: [
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== 'production' &&
    process.env.REPL_ID !== undefined
      ? [(await import('@replit/vite-plugin-cartographer')).cartographer()]
      : []),
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
}));
