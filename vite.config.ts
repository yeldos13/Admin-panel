import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// relative base so the build works under any GitHub Pages repo path
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
