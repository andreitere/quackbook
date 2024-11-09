import VueMacros from "unplugin-vue-macros/vite";
import {defineConfig} from "vite";
import path from "node:path";
import vue from "@vitejs/plugin-vue";
import tailwind from "tailwindcss";
import autoprefixer from "autoprefixer";
import Unfonts from "unplugin-fonts/vite";
import Icons from "unplugin-icons/vite";
import UnoCSS from "unocss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
  },
  plugins: [
    UnoCSS(),
    Unfonts({
      google: {
        preconnect: true,
        families: ["Roboto Mono"],
      },
    }),
    Icons({
      // experimental
      autoInstall: true,
    }),
    VueMacros({
      reactivityTransform: true,
      plugins: {
        vue: vue({
          template: {
            compilerOptions: {
              // treat all tags with a dash as custom elements
              isCustomElement: (tag) => tag.includes('perspective-viewer')
            }
          }
        }),
      },
    }),
    // ReactivityTransform()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
