import { defineConfig } from 'vite';

export default defineConfig({
  base: '/data_color_toolkit/',
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
