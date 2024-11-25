import path from 'path'
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

const setPath = (dir) => {
  return path.resolve(__dirname,dir)
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      "lib": setPath("./src/lib/"),
      "utils": setPath("./src/utils/"),
      "store": setPath("./src/store/"),
      "assets": setPath("./src/assets/"),
      "server": setPath("./src/server/"),
    }
  }
})
