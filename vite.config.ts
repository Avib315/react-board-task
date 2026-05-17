import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      // `@/` maps to `src/` — use in TS/TSX: import Foo from '@/components/Foo/Foo'
      '@': path.resolve(__dirname, 'src'),
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        // `@use 'variables' as v` works from any SCSS file, no relative paths needed
        loadPaths: [path.resolve(__dirname, 'src/styles')],
      },
    },
  },

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    exclude: ['node_modules', 'tests/e2e/**'],
  },
})
