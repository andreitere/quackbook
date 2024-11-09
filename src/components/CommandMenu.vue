<script setup lang="ts">
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator} from "@/components/ui/command"
import {Dialog, DialogContent} from "@/components/ui/dialog"

import {useColorMode, useMagicKeys} from "@vueuse/core";
import {ref, watch} from "vue";
import {Button} from "@/components/ui/button";
import {useMetaStore} from "@/store/meta.ts";
import {useProjects} from "@/store/project.ts";

const colorMode = useColorMode()
const $meta = useMetaStore()

defineEmits(["add-cell-sql", "add-cell-markdown", "new-project", "convert-to-console", "convert-to-notebook"])

const $projects = useProjects()

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
            <CommandItem value="save" @select="$projects.saveProject">
              <div class="i-pixelarticons:save w-4 h-4 mr-2"></div>
              <span>save project</span>
            </CommandItem>
            <CommandItem value="share" @select="$projects.shareProject">
              <div class="i-pixelarticons:open w-4 h-4 mr-2"></div>
              <span>share</span>
            </CommandItem>
            <CommandItem value="convert-to-notebook" class="items-center flex" v-if="$projects.activeProject.value.mode == 'console'" @select="$projects.convertToNotebook">
              <div class="i-mdi:notebook-edit-outline w-4 h-4 mr-2"></div>
              <span>convert to notebook</span>
            </CommandItem>
            <CommandItem value="convert-to-console" class="items-center flex" v-if="$projects.activeProject.value.mode == 'notebook'" @select="$projects.convertToConsole">
              <div class="i-fluent:window-console-20-filled w-4 h-4 mr-2"></div>
              <span>convert to console</span>
            </CommandItem>
            <CommandItem value="new-add-cell-sql" class="items-center flex" @select="$projects.addCell('sql')">
              <div class="i-material-symbols:sheets-add-on w-4 h-4 mr-2"></div>
              <span>add sql cell</span>
            </CommandItem>
            <CommandItem value="new-add-cell-markdown" class="items-center flex" @select="$projects.addCell('markdown')">
              <div class="i-ion:logo-markdown w-4 h-4 mr-2"></div>
              <span>add markdown cell</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator/>
          <CommandGroup heading="Projects">
            <CommandItem :value="project.name" v-for="project in $projects.projects.value.slice(0,3)" @select="$projects.setActiveProject(project)">
              <div class="flex justify-between items-center w-full">
                <span>{{ project.name }}</span>
              </div>
            </CommandItem>
            <CommandSeparator/>
            <CommandItem value="list all projects" class="items-center flex" @select="$emit('new-project')">
              <div class="i-ic:baseline-menu-book w-4 h-4 mr-2"></div>
              <span>all projects</span>
            </CommandItem>
            <CommandItem value="new project" class="items-center flex" @select="$emit('new-project')">
              <div class="i-pixelarticons:briefcase-plus w-4 h-4 mr-2"></div>
              <span>new project</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator/>
          <CommandGroup heading="Settings">
            <CommandItem value="whats-this">
              <div class="flex justify-between items-center w-full">
                <span>what's this?</span>
              </div>
            </CommandItem>
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