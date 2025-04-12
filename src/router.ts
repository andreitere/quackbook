import { useMetaStore } from "@/store/meta.ts";
import About from "@/views/AboutView.vue";
import HelpView from "@/views/HelpView.vue";
import ImportView from "@/views/ImportView.vue";
import ProjectsView from "@/views/ProjectsView.vue";
import Workbench from "@/views/Workbench.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path: "/import/:project_json?",
        component: ImportView,
    },
    {
        path: "/",
        name: "workbench",
        component: Workbench,
    },
    {
        path: "/about",
        name: "about",
        component: About,
    },
    {
        path: "/help",
        name: "help",
        component: HelpView,
    },
    {
        path: "/projects",
        name: "projects",
        component: ProjectsView,
    },
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((_, __, next) => {
    useMetaStore().cmdMenu = false;
    next();
});
