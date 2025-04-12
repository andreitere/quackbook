import { defineConfig } from "vite"
import path from "node:path"
import vue from "@vitejs/plugin-vue"
import tailwind from "tailwindcss"
import autoprefixer from "autoprefixer"
import Unfonts from "unplugin-fonts/vite"
import Icons from "unplugin-icons/vite"
import UnoCSS from "unocss/vite"
import removeConsole from "vite-plugin-remove-console"

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProd = mode === "production" // Adjust the condition as needed

  return {
    optimizeDeps: {
      exclude: ["@electric-sql/pglite"],
    },
    build: {
      target: "esnext",
      sourcemap: true,
    },
    css: {
      postcss: {
        plugins: [tailwind(), autoprefixer()],
      },
    },
    plugins: [
      vue({
        template: {
          compilerOptions: {
            isCustomElement: (tag) => ["perspective-viewer", "perspective-viewer-datagrid", "perspective-viewer-d3fc"].includes(tag),
          },
        },
      }),
      UnoCSS(),
      Unfonts({
        google: {
          preconnect: true,
          families: ["Roboto Mono", "Poppins", "Inter"],
        },
      }),
      Icons({
        // experimental
        autoInstall: true,
      }),
      {
        name: "html-transform",
        transformIndexHtml(html) {
          if (isProd) {
            return html.replace(
              "</head>",
              `<script defer src="https://analytics.cloudcrafts.club/script.js" data-website-id="918cc775-65fc-418c-be8c-8597cdd1a450"></script>\n</body>`
            )
          }
          return html
        },
      },
      removeConsole(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }
})
