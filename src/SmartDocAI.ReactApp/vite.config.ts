import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  //base: '/SmartDocAI/',
  base: '/',
  server:{
    port: 3000,
    strictPort: true,
    host: 'localhost',
    open: true,
    cors: true
  },
  
})
