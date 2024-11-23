<script setup lang="ts">
import CommandMenu from "@/components/CommandMenu.vue";
import Toaster from "@/components/ui/toast/Toaster.vue";
import {useMetaStore} from "@/store/meta.ts";
import {useProjects} from "@/store/project.ts";
import {useMagicKeys} from "@vueuse/core";
import {watch} from "vue";
import {useRoute} from "vue-router";
import {Button} from "./components/ui/button";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {useQuackDuck} from "@/hooks/useQuackDuck.ts";

const {playQuack} = useQuackDuck()
const $meta = useMetaStore();
const $projects = useProjects();
const $route = useRoute();
const openMenu = () => {
  // if(!cmdMenu.value) return;
  $meta.cmdMenu = true;
};


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
      <Button size="xs" class="text-xs space-x-1 cursor-pointer" @click="openMenu" data-umami-event="command-menu">
        <div class="i-pixelarticons:command h-4 w-4"></div>
      </Button>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <router-link as-child to="/">
              <h1 class="text-xl">QuackBook</h1>
            </router-link>
          </TooltipTrigger>
          <TooltipContent align="center" hide-when-detached>
            <div @click="playQuack">quack 🦆</div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>


      <div class="h-[50%] w-[1px] mx-5 bg-gray-500"></div>
      <div class="flex items-center space-x-1">

        <router-link to="/import">
          <Button variant="ghost" size="xs" class="text-sm">
            import
          </Button>
        </router-link>
        <router-link to="/about">
          <Button variant="ghost" size="xs" class="text-sm">
            about
          </Button>
        </router-link>
      </div>
      <div class="flex flex-grow"></div>
      <div class="flex items-center">
        <router-link to="/help">
          <Button variant="ghost">
            <div class="i-lucide:circle-help"></div>
          </Button>
        </router-link>
        <a href="https://github.com/andreitere/quackbook" data-umami-event="github" target="_blank">
          <Button variant="ghost">
            <div class="i-bi:github w-4 h-4"></div>
          </Button>
        </a>
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
