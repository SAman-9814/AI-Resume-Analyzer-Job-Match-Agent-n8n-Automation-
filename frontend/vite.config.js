import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  server: {
    proxy: {
      '/webhook-test': {
        target: 'https://amansah.app.n8n.cloud',
        changeOrigin: true,
      }
    }
  }
})
