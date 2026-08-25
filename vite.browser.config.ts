import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        urn: resolve(__dirname, 'src/urn.ts'),
        instrument: resolve(__dirname, 'src/instrument.ts'),
      },
      formats: ['es'],
    },
    outDir: resolve(__dirname, 'dist-browser'),
    emptyOutDir: true,
    rollupOptions: {
      external: [],
    },
  },
});
