import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
    deps: { interopDefault: true },
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/**/*.test.ts'],
    },
  },
  esbuild: { target: 'node18' },
  resolve: { alias: { './mockStore': './mockStore.ts' } },
});
