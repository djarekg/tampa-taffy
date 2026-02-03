import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3006,
    hmr: true,
  },
  optimizeDeps: {
    include: ['@lit/reactive-element', 'lit', '@libsql/client'],
    exclude: ['@prisma/client'],
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
      'lit',
      'lit/decorators',
      'lit/directives',
      'lit-html',
      'lit-element',
    ],
  },
});
