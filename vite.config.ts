/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      name: 'storageHook',
      formats: ['es', 'iife'],
      entry: './lib/index.ts'
    },
    sourcemap: true
  },
  test: {
    environment: 'happy-dom',
    coverage: {
      reporter: ['clover']
    }
  }
})
