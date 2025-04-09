import "virtual:uno.css"
import Sortable from "sortablejs"
;(window as unknown as any).Sortable = Sortable
import "slickgrid/dist/styles/css/slick-alpine-theme.css"
import "./assets/index.scss"
import { router } from "@/router.ts"
import { createPinia } from "pinia"
import { createApp } from "vue"
import App from "./App.vue"

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount("#app")
