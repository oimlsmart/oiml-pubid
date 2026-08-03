import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index',
    },
    outDir: resolve(__dirname, 'dist-browser'),
    emptyOutDir: true,
    rollupOptions: {
      external: [],
    },
  },
});
