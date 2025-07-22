import {defineConfig} from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    coverage:{
        reporter: ['text', 'json', 'html'],
        reportsDirectory: './coverage',
        exclude: ['**/node_modules/**', '**/src/__tests__/**'],
    }
  }
});