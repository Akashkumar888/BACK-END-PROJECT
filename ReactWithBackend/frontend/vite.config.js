import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'  // first tailWind then react 
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    tailwindcss(),   // first tailWind then react 
    react(),
  ],
})

