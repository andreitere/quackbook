<script setup lang="ts">
import { useColorMode, useMagicKeys } from '@vueuse/core'
import { reactive, watch } from "vue";
import EditorCell from "@/components/EditorCell.vue";
import { Button } from './components/ui/button';
import { Label } from './components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Switch } from "@/components/ui/switch"

import { useMemory } from '@vueuse/core'
import { bytesToGB } from './lib/utils';

const { isSupported: isUseMemSupported, memory } = useMemory()

const mode = useColorMode() // Ref<'dark' | 'light'>
const toggleColorMode = () => {
  if (mode.value === 'light') {
    mode.value = 'dark';
  } else {
    mode.value = 'light'
  }
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
        <div @click="show.toolBar = !show.toolBar" :class="[
          show.toolBar ? `i-octicon:sidebar-expand-24` : `i-octicon:sidebar-collapse-24`,
          'cursor-pointer h-5 w-5'
        ]">
        </div>
        <h1 class="text-xl">DuckBench</h1>
        <div class="h-full w-[1px] bg-gray-500"></div>
        <div class="flex items-center space-x-4">
          <div class="flex items-center text-xs space-x-2 rounded border-[1px] py-1 px-2">
            <span>default</span>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <button class="border-[1px] rounded p-[1px] hover:bg-gray-800 hover:text-white">
                  <div class="i-pixelarticons:edit-box"></div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent class="space-y-2">
                <div class="flex items-center space-x-2 p-2 text-xs">
                  <Switch id="single-mode" />
                  <Label for="signle-mode">Single Mode</Label>
                </div>
                <DropdownMenuItem>share</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem>Subscription</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel class="text-xs text-red-600">delete</DropdownMenuLabel>
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
          <Button size="xs" class="text-xs space-x-1">
            <!-- <span>new project</span> -->
            <div class="i-pixelarticons:folder-plus h-4 w-4"></div>
          </Button>
        </div>
        <div class="flex flex-grow"></div>
        <div class="flex items-center space-x-2 text-xs">
          <span v-if="isUseMemSupported">Browser Mem (GB): {{ bytesToGB(memory?.usedJSHeapSize) }} / {{
            bytesToGB(memory?.jsHeapSizeLimit) }} (GB)</span>

        </div>
      </header>
      <div class="flex main flex-grow">
        <div class="tool-bar items-center flex flex-col space-y-3 [&>*]:py-4" v-if="show.toolBar">
          <Button size="xs" variant="ghost" class="space-x-1">
            <div class="i-material-symbols-light:text-snippet-outline-rounded h-8 w-8"></div>
            <span>Snippets</span>
          </Button>
          <Button size="xs" variant="ghost" class="space-x-1">
            <div class="i-material-symbols-light:text-snippet-outline-rounded h-8 w-8"></div>
          </Button>
          <Button size="xs" variant="ghost" class="space-x-1">
            <div class="i-material-symbols-light:text-snippet-outline-rounded h-8 w-8"></div>
          </Button>
        </div>
        <div :class="[
          'flex flex-col w-full items-start justify-start space-y-4 px-2',
        ]">
          <EditorCell :single-mode="true" />
        </div>
      </div>
    </div>
    <div class="utils-bar bg-green-300"></div>
  </div>
</template>

<style scoped></style>
