// import "https://cdn.jsdelivr.net/npm/@finos/perspective-viewer@3.5.0/dist/cdn/perspective-viewer.js";
// import "https://cdn.jsdelivr.net/npm/@finos/perspective-viewer-datagrid@3.5.0/dist/cdn/perspective-viewer-datagrid.js";
// import "https://cdn.jsdelivr.net/npm/@finos/perspective-viewer-d3fc@3.5.0/dist/cdn/perspective-viewer-d3fc.js";
import "@finos/perspective-viewer/dist/css/pro.css";
import "virtual:uno.css"
// @ts-ignore
import Sortable from "sortablejs"
;(window as unknown as any).Sortable = Sortable
import "slickgrid/dist/styles/css/slick-alpine-theme.css"
import "./assets/index.scss"
import { router } from "@/router.ts"
import { createPinia } from "pinia"
import { createApp } from "vue"
import App from "./App.vue"
import { initPerspective } from "./lib/perspective"

// Initialize perspective before creating the app
await initPerspective();

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount("#app")
