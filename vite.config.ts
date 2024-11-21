import {defineConfig} from "vite";
import path from "node:path";
import vue from "@vitejs/plugin-vue";
import tailwind from "tailwindcss";
import autoprefixer from "autoprefixer";
import Unfonts from "unplugin-fonts/vite";
import Icons from "unplugin-icons/vite";
import UnoCSS from "unocss/vite";

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  const isProd = mode === "production"; // Adjust the condition as needed

  return {
    build: {
      sourcemap: true,
      rollupOptions: {
        external: ["react-async-hook"]
      }
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
            // treat all tags with a dash as custom elements
            isCustomElement: (tag) => tag.includes("perspective-viewer"),
          },
        },
      }),
      UnoCSS(),
      Unfonts({
        google: {
          preconnect: true,
          families: ["Roboto Mono", "Poppins"],
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
            );
          }
          return html;
        },
      },
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },

  };
});
