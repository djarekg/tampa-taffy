import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'esnext',
    sourcemap: true,
    rollupOptions: {
      output: {
        sourcemapPathTransform: relativeSourcePath => {
          return relativeSourcePath;
        },
      },
    },
  },
  server: {
    port: 3006,
    hmr: true,
    sourcemapIgnoreList: () => false,
  },
  css: {
    devSourcemap: true,
  },
  esbuild: {
    sourcemap: 'inline',
  },
  define: {
    __DEV__: JSON.stringify(true),
  },
  optimizeDeps: {
    include: [
      '@lit/reactive-element',
      '@lit-labs/signals',
      '@lit/context',
      '@lit/task',
      'lit',
      'lit-element',
      'lit-html',
      'signal-polyfill',
      'signal-utils',
      '@libsql/client',
      '@m3e/core',
      '@m3e/button',
      '@m3e/icon',
      '@m3e/icon-button',
      '@m3e/form-field',
      '@m3e/theme',
    ],
    exclude: ['@prisma/client', '@tt/core', '@tt/components', '@tt/db'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@tt/components': resolve(__dirname, '../../packages/components/src'),
      '@tt/core': resolve(__dirname, '../../packages/core/src'),
      '@tt/db': resolve(__dirname, '../../packages/db/src'),
    },
    preserveSymlinks: true,
    conditions: ['browser', 'development'],
    dedupe: [
      '@lit/reactive-element',
      '@lit-labs/signals',
      '@lit/context',
      '@lit/task',
      'lit',
      'lit/decorators',
      'lit/directives',
      'lit-html',
      'lit-element',
      'signal-polyfill',
      'signal-utils',
      '@m3e/core',
      '@m3e/button',
      '@m3e/icon',
      '@m3e/icon-button',
      '@m3e/form-field',
      '@m3e/theme',
    ],
  },
});
