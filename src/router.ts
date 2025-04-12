import { useMetaStore } from '@/store/meta.ts';
import About from '@/views/AboutView.vue';
import HelpView from '@/views/HelpView.vue';
import ImportView from '@/views/ImportView.vue';
import ProjectsView from '@/views/ProjectsView.vue';
import Workbench from '@/views/Workbench.vue';
import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
    {
        path: '/import/:project_json?',
        component: ImportView,
    },
    {
        path: '/',
        name: 'workbench',
        query: {
            quackMode: false,
            serverPort: 3000,
        },
        component: Workbench,
    },
    {
        path: '/about',

        name: 'about',
        component: About,
    },
    {
        path: '/help',
        name: 'help',
        component: HelpView,
    },
    {
        path: '/projects',
        name: 'projects',
        component: ProjectsView,
    },
];

export const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach((_, __, next) => {
    useMetaStore().cmdMenu = false;
    next();
});
