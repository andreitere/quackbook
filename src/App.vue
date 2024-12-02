<script setup lang="ts">
import CommandMenu from "@/components/CommandMenu.vue";
import Toaster from "@/components/ui/toast/Toaster.vue";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useQuackDuck } from "@/hooks/useQuackDuck.ts";
import { useMetaStore } from "@/store/meta.ts";
import { useProjects } from "@/store/project.ts";
import { useMagicKeys } from "@vueuse/core";
import { watch } from "vue";
import { useRoute } from "vue-router";
import { Button } from "./components/ui/button";

const { playQuack } = useQuackDuck();
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

const { meta, shift, e } = useMagicKeys({
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
    <header class="flex items-center p-1 md:p-3 space-x-2 md:space-x-4 border-b-[1px] border-solid border-slate-200">
      <Button size="xs" class="text-xs cursor-pointer hidden md:block" @click="openMenu"
        data-umami-event="command-menu">
        <div class="i-pixelarticons:command h-4 w-4"></div>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button size="xs" class="text-xs cursor-pointer md:hidden" data-umami-event="command-menu">
            <div class="i-lucide-square-menu"></div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="max-h-[80dvh] overflow-y-scroll nice-scrollbar">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <div class="i-lucide:share w-4 h-4 mr-2"></div>
              <span>share</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div class="i-lucide:save w-4 h-4 mr-2"></div>
              <span>save project</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div class="i-hugeicons:sql w-4 h-4 mr-2"></div>
              <span>add sql cell</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div class="i-ion:logo-markdown w-4 h-4 mr-2"></div>
              <span>add markdown cell</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem to="/projects">
              <span>Projects</span>
            </DropdownMenuItem>
            <DropdownMenuItem value="new project" data-umami-event="new-project" class="items-center flex"
              @select="$projects.createProject">
              <div class="i-lucide:list-plus w-4 h-4 mr-2"></div>
              <span>new project</span>
            </DropdownMenuItem>
            <DropdownMenuItem data-umami-event="open-project" v-for="project in $projects.projects"
              @select="$projects.setActiveProject(project)">
              <div class="flex justify-between items-center w-full">
                <span class="text-muted-foreground">{{ project.name }}</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <router-link as-child to="/">
              <h1 class="text-xl">QuackBook</h1>
              <!-- <h1 class="text-xl md:hidden">QB</h1> -->
            </router-link>
          </TooltipTrigger>
          <TooltipContent align="center" hide-when-detached>
            <div @click="playQuack">quack 🦆</div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>


      <div class="h-[50%] w-[1px] mx-5 bg-gray-500 hidden md:block"></div>
      <div class="hidden items-center space-x-1 md:flex">
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
        <Button variant="ghost" data-umami-event="show-db-schema" @click="$meta.showToolbar = !$meta.showToolbar"
          v-if="$route.name === 'workbench'">
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
    <CommandMenu ref="cmdMenu" v-on="commandEvents" />
    <Toaster />

  </div>
</template>

<style scoped></style>
