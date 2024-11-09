<script setup lang="ts">
import {useColorMode, useMagicKeys, useMemory} from '@vueuse/core'
import {reactive, ref, watch} from "vue";
import EditorCell from "@/components/EditorCell.vue";
import {Button} from './components/ui/button';
import Toaster from '@/components/ui/toast/Toaster.vue'
import {bytesToGB} from './lib/utils';
import CommandMenu from "@/components/CommandMenu.vue";
import {useMetaStore} from "@/store/meta.ts";
import DBSchemaDetails from "@/components/DBSchemaDetails.vue";
import {useProjects} from "@/store/project.ts";
import {Input} from "@/components/ui/input";

const $meta = useMetaStore()
const $projects = useProjects();

const {isSupported: isUseMemSupported, memory} = useMemory()

const mode = useColorMode() // Ref<'dark' | 'light'>

const cmdMenu = ref(null);

const openMenu = () => {
  // if(!cmdMenu.value) return;
  $meta.cmdMenu = true;
  console.log($meta.cmdMenu);
}
const show = reactive({
  toolBar: false,
  utilsBar: false,
})

const keys = useMagicKeys();

const cmdShiftE = keys['Option+Shift+E'];


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

watch(cmdShiftE, (v) => {
  if (!v) return;
  console.log(`cmdShiftE`, v);
  show.toolBar = !show.toolBar;
})


</script>

<template>
  <div class="w-full h-full flex flex-col relative">
    <header class="flex items-center p-3 space-x-2 border-b-[1px] border-solid border-slate-200">
      <h1 class="text-xl">DuckBench</h1>
      <div class="h-full w-[1px] bg-gray-500"></div>
      <div class="flex items-center space-x-4">
        <Button size="xs" class="text-xs space-x-1 cursor-pointer" @click="openMenu">
          <div class="i-pixelarticons:command h-4 w-4"></div>
        </Button>
      </div>
      <div class="flex flex-grow justify-center">
        <Input v-model:model-value="$projects.activeProject.value.name"
               class="max-w-[400px] border-slate-200  bg-slate-200 dark:bg-slate-500 text-center focus:bg-slate-100 dark:focus:bg-slate-900"/>
      </div>
      <div class="flex items-center space-x-2 text-xs">
          <span v-if="isUseMemSupported">Browser Mem (GB): {{ bytesToGB(memory?.usedJSHeapSize) }} / {{
              bytesToGB(memory?.jsHeapSizeLimit)
            }} (GB)</span>

      </div>
      <div @click="$meta.showToolbar = !$meta.showToolbar" :class="[
          show.toolBar ? `i-octicon:sidebar-collapse-24` : `i-octicon:sidebar-expand-24`,
          'cursor-pointer h-5 w-5'
        ]">
      </div>
    </header>
    <div class="flex flex-row flex-grow">
      <div class="flex flex-grow flex-col h-full max-h-full px-2  py-4">
        <div class="overflow-y-scroll nice-scrollbar flex flex-col h-0 flex-grow space-y-6">
          <div v-for="cell in $projects.sortedCells.value"  v-if="$projects.activeProject.value.mode == 'notebook'" class="w-full">
            <EditorCell :mode="$projects.activeProject.value.mode" v-model:query="cell.query" :id="cell.id" :position="cell.position"/>
          </div>
          <EditorCell v-if="$projects.activeProject.value.mode == 'console'" :mode="$projects.activeProject.value.mode"
                      v-model:query="$projects.activeProject.value.cells[0].query"/>
        </div>
      </div>
      <div :class="[
            'tool-bar items-center flex flex-col space-y-3 overflow-y-scroll nice-scrollbar h-full',
            $meta.showToolbar ? 'w-1/3' : 'w-0 opacity-0'
        ]">
        <div class="overflow-y-scroll h-0 flex-grow w-full">
          <DBSchemaDetails class="w-full"/>
        </div>
      </div>
    </div>
    <CommandMenu ref="cmdMenu" v-on="commandEvents"/>
    <Toaster/>

  </div>
</template>

<style scoped></style>
