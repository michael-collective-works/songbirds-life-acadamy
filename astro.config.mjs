import {defineConfig} from 'astro/config'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  site: 'https://songbirdslifeacademy.com',
  vite: {
    plugins: [tailwindcss()],
  },
})
