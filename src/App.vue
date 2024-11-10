<script setup lang="ts">
import {useMagicKeys, useMemory} from '@vueuse/core'
import {watch} from "vue";
import {Button} from './components/ui/button';
import Toaster from '@/components/ui/toast/Toaster.vue'
import {bytesToGB} from './lib/utils';
// import CommandMenu from "@/components/CommandMenu.vue";
import {useMetaStore} from "@/store/meta.ts";
import {useProjects} from "@/store/project.ts";
import {Input} from "@/components/ui/input";
import {useRoute} from "vue-router";
import CommandMenu from "@/components/CommandMenu.vue";
import NotificationsCard from "@/components/NotificationsCard.vue";

const $meta = useMetaStore()
const $projects = useProjects();
const $route = useRoute()
const {isSupported: isUseMemSupported, memory} = useMemory()


const openMenu = () => {
  // if(!cmdMenu.value) return;
  $meta.cmdMenu = true;
}


const commandEvents = {
  "add-cell-sql": () => {
    console.log("add cell sql")
  },
  "new-project": () => {
    $projects.createProject()
  },
  "save": () => {
    console.log("save project")
    $projects.saveProject()
  }
}

const {meta, shift, e} = useMagicKeys({
  passive: false,
  onEventFired: function (e) {
    if (e.key === 'e' && (e.metaKey || e.ctrlKey) && e.key === 'shift')
      e.preventDefault()
  },
})

watch([meta, shift, e], (v) => {
  if ((v[0] && v[1] && v[2])) {
    $meta.showToolbar = !$meta.showToolbar;
  }
})

</script>

<template>
  <div class="w-full h-full flex flex-col relative">
    <header class="flex items-center p-3 space-x-4 border-b-[1px] border-solid border-slate-200">
      <h1 class="text-xl">DuckBook</h1>
      <div class="h-[50%] w-[1px] mx-5 bg-gray-500"></div>
      <div class="flex items-center space-x-4">
        <Button size="xs" class="text-xs space-x-1 cursor-pointer" @click="openMenu" data-umami-event="command-menu">
          <div class="i-pixelarticons:command h-4 w-4"></div>
        </Button>
      </div>
      <div class="flex flex-grow justify-center space-x-2">
        <Input v-model:model-value="$projects.activeProject.value.name"
               v-if="$route.name === 'workbench'"
               class="max-w-[400px] border-slate-200  bg-slate-200 dark:bg-slate-500 text-center focus:bg-slate-100 dark:focus:bg-slate-900"/>
        <NotificationsCard/>
      </div>
      <div class="flex items-center space-x-2 text-xs">
          <span v-if="isUseMemSupported && memory">Browser Mem (GB): {{ bytesToGB(memory.usedJSHeapSize) }} / {{
              bytesToGB(memory.jsHeapSizeLimit)
            }} (GB)</span>

      </div>
      <div data-umami-event="" @click="$meta.showToolbar = !$meta.showToolbar" :class="[
          $meta.showToolbar ? `i-octicon:sidebar-collapse-24` : `i-octicon:sidebar-expand-24`,
          'cursor-pointer h-5 w-5'
        ]">
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
