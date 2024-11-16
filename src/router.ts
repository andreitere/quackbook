import { createRouter, createWebHistory } from "vue-router";
import ImportView from "@/views/ImportView.vue";
import Workbench from "@/views/Workbench.vue";
import { useMetaStore } from "@/store/meta.ts";
import About from "@/views/AboutView.vue";
import ProjectsView from "@/views/ProjectsView.vue";
import MountFileSystem from "@/views/MountFileSystem.vue";

const routes = [
	{
		path: "/import/:project_json",
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
		path: "/mount-file-system",
		name: "mount-file-system",
		component: MountFileSystem,
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
