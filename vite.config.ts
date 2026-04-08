import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['pdfjs-dist']
  },
  worker: {
    format: 'es'
  },
  server: {
    fs: {
      allow: ['..']
    }
  },
  define: {
    global: 'globalThis',
  },
  assetsInclude: ['**/*.pdf'],
  build: {
    assetsInlineLimit: 0 // Don't inline PDFs
  }
})
