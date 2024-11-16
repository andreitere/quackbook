<script setup lang="ts">
import CommandMenu from "@/components/CommandMenu.vue";
import NotificationsCard from "@/components/NotificationsCard.vue";
import {Input} from "@/components/ui/input";
import Toaster from "@/components/ui/toast/Toaster.vue";
import {useMetaStore} from "@/store/meta.ts";
import {useProjects} from "@/store/project.ts";
import {useMagicKeys} from "@vueuse/core";
import {watch} from "vue";
import {useRoute} from "vue-router";
import {Button} from "./components/ui/button";

const $meta = useMetaStore();
const $projects = useProjects();
const $route = useRoute();
const openMenu = () => {
  // if(!cmdMenu.value) return;
  $meta.cmdMenu = true;
};

const quack = new Audio("/assets/duck_quack.mp3");
const clickOnDuckDoQuack = () => {
  quack.play()
}

const commandEvents = {
  "add-cell-sql": () => {
    console.log("add cell sql");
  },
  "new-project": () => {
    $projects.createProject();
  },
  save: () => {
    console.log("save project");
    $projects.saveProject();
  },
};

const {meta, shift, e} = useMagicKeys({
  passive: false,
  onEventFired: (e) => {
    if (e.key === "e" && (e.metaKey || e.ctrlKey) && e.shiftKey)
      e.preventDefault();
  },
});

watch([meta, shift, e], (v) => {
  if (v[0] && v[1] && v[2]) {
    $meta.showToolbar = !$meta.showToolbar;
  }
});
</script>

<template>
  <div class="w-full h-full flex flex-col relative">
    <header class="flex items-center p-3 space-x-4 border-b-[1px] border-solid border-slate-200">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <router-link as-child to="/">
              <h1 class="text-xl">QuackBook</h1>
            </router-link>
          </TooltipTrigger>
          <TooltipContent align="center" hide-when-detached>
            <div @click="clickOnDuckDoQuack">quack 🦆</div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>


      <div class="h-[50%] w-[1px] mx-5 bg-gray-500"></div>
      <div class="flex items-center space-x-4">
        <Button size="xs" class="text-xs space-x-1 cursor-pointer" @click="openMenu" data-umami-event="command-menu">
          <div class="i-pixelarticons:command h-4 w-4"></div>
        </Button>
      </div>
      <div class="flex flex-grow justify-center space-x-2 items-center">
        <Input v-model:model-value="$projects.activeProject.value.name"
               v-if="$route.name === 'workbench'"
               class="max-w-[400px] border-slate-200  bg-slate-200 dark:bg-slate-500 text-center focus:bg-slate-100 dark:focus:bg-slate-900"/>
        <NotificationsCard v-if="$route.name === 'workbench'"/>
      </div>
      <div class="flex items-center">
        <Button variant="ghost">
          <a href="https://github.com/andreitere/quackbook" data-umami-event="github" target="_blank" class="i-bi:github w-5 h-5"></a>
        </Button>
        <Button variant="ghost" data-umami-event="show-db-schema" @click="$meta.showToolbar = !$meta.showToolbar" v-if="$route.name === 'workbench'">
          <div :class="[
          $meta.showToolbar ? `i-octicon:sidebar-collapse-24` : `i-octicon:sidebar-expand-24`,
          'cursor-pointer h-5 w-5'
        ]">
          </div>
        </Button>
      </div>
    </header>
    <div class="flex flex-row flex-grow">
      <router-view></router-view>
    </div>
    <CommandMenu ref="cmdMenu" v-on="commandEvents"/>
    <Toaster/>

  </div>
</template>

<style scoped></style>
