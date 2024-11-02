import {defineConfig} from 'vite';
import path from 'node:path';
import vue from '@vitejs/plugin-vue'
import tailwind from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import Unfonts from 'unplugin-fonts/vite'
import Icons from 'unplugin-icons/vite'
import UnoCSS from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()]
    },
  },
  plugins: [
    UnoCSS(),
    vue(),
    Unfonts({
      google: {
        preconnect: true,
        families: [
          "Delius Swash Caps"
        ]
      }
    }),
    Icons({
      // experimental
      autoInstall: true,
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
