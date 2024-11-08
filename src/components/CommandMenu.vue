<script setup lang="ts">
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator} from "@/components/ui/command"
import {Dialog, DialogContent} from "@/components/ui/dialog"

import {useColorMode, useMagicKeys} from "@vueuse/core";
import {ref, watch} from "vue";
import {Button} from "@/components/ui/button";
import {useMetaStore} from "@/store/meta.ts";

const colorMode = useColorMode()
const $meta = useMetaStore()

let open = ref(false)


const keys = useMagicKeys();

const cmdK = keys['Cmd+K'];


const onColorModeToggle = () => {
  if (colorMode.value === 'light') {
    colorMode.value = 'dark'
  } else {
    colorMode.value = 'light'
  }
  $meta.cmdMenu = false;
}


watch(cmdK, (v) => {
  if (!v) return;
  $meta.cmdMenu = !$meta.cmdMenu;
})

</script>

<template>
  <Dialog v-model:open="$meta.cmdMenu">
    <DialogContent class="p-0 m-0">
      <Command class="rounded-lg border shadow-md ">
        <CommandInput placeholder="Type a command or search..."/>
        <CommandList class="max-h-[60vh]">
          <CommandEmpty>No results found.</CommandEmpty>


          <CommandGroup heading="Actions">
            <CommandItem value="save">
              <div class="i-pixelarticons:save w-4 h-4 mr-2"></div>
              <span>save</span>
            </CommandItem>
            <CommandItem value="share">
              <div class="i-pixelarticons:open w-4 h-4 mr-2"></div>
              <span>share</span>
            </CommandItem>
            <CommandItem value="new project" class="items-center flex">
              <div class="i-pixelarticons:briefcase-plus w-4 h-4 mr-2"></div>
              <span>new project</span>
            </CommandItem>
            <CommandItem value="convert-to-notebook" class="items-center flex">
              <div class="i-mdi:notebook-edit-outline w-4 h-4 mr-2"></div>
              <span>convert to notebook</span>
            </CommandItem>
            <CommandItem value="convert-to-console" class="items-center flex">
              <div class="i-fluent:window-console-20-filled w-4 h-4 mr-2"></div>
              <span>convert to console</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator/>
          <CommandGroup heading="Projects">
            <CommandItem value="default">
              <div class="flex justify-between items-center w-full">
                <span>default</span>
                <div>
                  <Button variant="ghost" class="current-line">open</Button>
                  <Button variant="ghost" class="current-line">delete</Button>
                </div>
              </div>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator/>
          <CommandGroup heading="Settings">
            <CommandItem value="theme light dark" @select="onColorModeToggle">
              <div class="flex justify-between items-center w-full">
                <span>switch to {{ colorMode == 'light' ? 'dark' : 'light' }} mode</span>
              </div>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </DialogContent>
  </Dialog>
</template>

<style scoped>

</style>