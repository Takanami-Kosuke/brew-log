import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    // ブラウザの代わりに jsdom で DOM を用意して、コンポーネントを動かす
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
