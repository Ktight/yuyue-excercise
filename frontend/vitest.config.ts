import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    // jsdom simulates a browser environment for component tests
    environment: 'jsdom',
    // Enable global test APIs: describe, it, expect, vi
    globals: true,
    // Global test setup: MSW server, cleanup, etc.
    setupFiles: ['./src/shared/testing/setup.ts'],
    // Process CSS imports in tests
    css: true,
  },
});
