import 'virtual:uno.css'

import "./assets/index.scss";
import {createApp} from "vue";
import App from "./App.vue";
import {router} from "@/router.ts";

const app = createApp(App);

app.use(router);
app.mount("#app");
