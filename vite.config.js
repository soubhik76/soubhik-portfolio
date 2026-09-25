import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Works on both Vercel and GitHub Pages.
// For GitHub Pages project sites, './' keeps asset paths relative.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './',
})
