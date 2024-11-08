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

const $meta = useMetaStore()

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


watch(cmdShiftE, (v) => {
  if (!v) return;
  console.log(`cmdShiftE`, v);
  show.toolBar = !show.toolBar;
})


</script>

<template>
  <div class="w-full h-full flex flex-col md:flex-row relative">
    <div class="w-full h-full flex-grow flex flex-col">
      <header class="flex items-center p-3 space-x-2 border-b-[1px] border-solid border-slate-200">
        <h1 class="text-xl">DuckBench</h1>
        <div class="h-full w-[1px] bg-gray-500"></div>
        <div class="flex items-center space-x-4">
          <Button size="xs" class="text-xs space-x-1 cursor-pointer" @click="openMenu">
            <div class="i-pixelarticons:command h-4 w-4"></div>
          </Button>
          <Button size="sm" variant="outline" class="cursor-pointer">
            What's this?
          </Button>
        </div>
        <div class="flex flex-grow"></div>
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
      <div class="flex main flex-grow">

        <div :class="[
          'flex flex-col w-full items-start justify-start space-y-4 px-2',
        ]">
          <EditorCell :single-mode="false"/>
          <EditorCell :single-mode="false"/>
          <EditorCell :single-mode="false"/>
          <EditorCell :single-mode="false"/>
          <EditorCell :single-mode="false"/>
        </div>
        <div :class="[
            'tool-bar items-center flex flex-col space-y-3 max-w-[1/3]',
            $meta.showToolbar ? 'w-1/3' : 'w-0 opacity-0'
        ]" >
          <DBSchemaDetails class="w-full"/>
        </div>
      </div>
    </div>
    <div class="utils-bar bg-green-300"></div>
    <CommandMenu ref="cmdMenu"/>
    <Toaster/>

  </div>
</template>

<style scoped></style>
