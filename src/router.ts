import { useMetaStore } from '@/store/meta.ts';
import About from '@/views/AboutView.vue';
import HelpView from '@/views/HelpView.vue';
import ProjectsView from '@/views/ProjectsView.vue';
import Workbench from '@/views/Workbench.vue';
import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
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
    {
        path: '/projects/:projectData',
        name: 'importProject',
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
