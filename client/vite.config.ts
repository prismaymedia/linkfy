import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal';
import tailwindcss from '@tailwindcss/vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__dirname);

// Plugin to generate 404.html for GitHub Pages SPA support
const generateGitHubPages404Plugin = () => ({
  name: 'generate-404-html',
  generateBundle() {
    const html404Content = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
    <title>Linkfy - YouTube Music to Spotify Converter</title>
    <meta name="description" content="Linkfy converts YouTube Music links to Spotify instantly. Perfect for Chrome extension usage with privacy-focused design." />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    
    <!-- GitHub Pages SPA redirect script -->
    <script type="text/javascript">
      // Single Page Apps for GitHub Pages
      // MIT License
      // https://github.com/rafgraph/spa-github-pages
      // This script takes the current url and converts the path and query
      // string into just a query string, and then redirects the browser
      // to the new url with only a query string and hash fragment,
      // e.g. https://www.foo.tld/one/two?a=b&c=d#qwe, becomes
      // https://www.foo.tld/?/one/two&a=b~and~c=d#qwe
      // Note: this 404.html file must be at least 512 bytes for it to work
      // with Internet Explorer (it is currently > 512 bytes)

      // If you're creating a Project Pages site and NOT using a custom domain,
      // then set pathSegmentsToKeep to 1 (enterprise users may need to set it to > 1).
      // This way the code will only replace the route part and not the real folder.
      // For example, if your repo is at https://username.github.io/repo-name,
      // then set pathSegmentsToKeep to 1 so that paths like /repo-name/one/two
      // will become /repo-name/?/one/two instead of /?/repo-name/one/two
      var pathSegmentsToKeep = 1;

      var l = window.location;
      l.replace(
        l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
        l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
        l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
        (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
        l.hash
      );
    </script>
  </head>
  <body>
    <!-- This content will not be shown because the script above redirects immediately -->
    <div>Redirecting...</div>
  </body>
</html>`;

    // Emit the 404.html file to the bundle
    this.emitFile({
      type: 'asset',
      fileName: '404.html',
      source: html404Content
    });
  }
});

export default defineConfig(async () => ({
  base: process.env.NODE_ENV === 'production' ? '/linkfy/' : '/',
  plugins: [
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    generateGitHubPages404Plugin(),
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
