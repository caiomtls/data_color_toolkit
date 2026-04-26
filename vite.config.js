import { defineConfig } from 'vite';

export default defineConfig({
  base: '/data-color-toolkit/',
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    open: true,
  },
});
