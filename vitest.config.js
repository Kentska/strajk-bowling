import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
	include: ['src/**/*.test.jsx'],
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },
});
