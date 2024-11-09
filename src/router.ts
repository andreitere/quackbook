import {createRouter, createWebHistory} from 'vue-router'
import ImportView from "@/views/ImportView.vue";
import Workbench from "@/views/Workbench.vue";

const routes = [
  {
    "path": "/import/:project_json",
    "component": ImportView
  },
  {
    "path": "/",
    "component": Workbench
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})