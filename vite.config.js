import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const isProduction = process.env.NODE_ENV === 'production'
const BASE_URL = isProduction ? '/colored-items/' : '/'

// https://vitejs.dev/config/
export default defineConfig({
  base: BASE_URL,
  plugins: [
    vue(),
  ],
  server: {
    open: true,
    port: 9000,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
