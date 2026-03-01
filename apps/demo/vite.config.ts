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
      'lit-ui-router',
      'signal-polyfill',
      'signal-utils',
      '@libsql/client',
    ],
    exclude: [
      '@m3e/web',
      '@prisma/client',
      '@tt/core',
      '@tt/components',
      '@tt/db',
    ],
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
      '@m3e/web',
      'lit',
      'lit/decorators',
      'lit/directives',
      'lit-html',
      'lit-element',
      'lit-ui-router',
      'signal-polyfill',
      'signal-utils',
    ],
  },
});
