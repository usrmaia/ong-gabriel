import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
 
export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'clover', 'json'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        'src/app/layout.tsx',
        'src/app/globals.css',
        '.next/',
        'coverage/',
        '**/*.config.*',
        '**/dist/',
        '**/*.test.*',
        '**/*.spec.*'
      ],
      all: false,
      include: ['src/**/*.{ts,tsx}'],
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})