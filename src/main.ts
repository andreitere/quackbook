import { router } from '@/router.ts';
import { createPinia } from 'pinia';
// @ts-ignore
import Sortable from 'sortablejs';
import { createApp } from 'vue';
import App from './App.vue';
import { initPerspective } from './lib/perspective';
import '@finos/perspective-viewer/dist/css/pro.css';
import 'virtual:uno.css';
import './assets/index.scss';

(window as unknown as any).Sortable = Sortable;

// Initialize perspective before creating the app
initPerspective();

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.mount('#app');
