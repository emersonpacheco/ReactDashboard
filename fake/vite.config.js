import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  
  plugins: [tailwindcss(),  react[{
    include: "**/*.tsx",
  }]],
  watch: {
    usePolling: true, // Enable or disable hot module replacement
  },
 })
