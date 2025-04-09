<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { useColorMode, useMagicKeys } from "@vueuse/core";
import { watch } from "vue";
import { useMetaStore } from "@/store/meta.ts";
import { useProjects } from "@/store/project.ts";
import { useRoute, useRouter } from "vue-router";
import { CommandDialog, Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
const colorMode = useColorMode();
const $meta = useMetaStore();

defineEmits([
  "add-cell-sql",
  "add-cell-markdown",
  "new-project",
  "convert-to-console",
  "convert-to-notebook",
]);

const $projects = useProjects();
const { activeProject } = $projects;
const $router = useRouter();
const $route = useRoute();
const onColorModeToggle = () => {
  if (colorMode.value === "light") {
    colorMode.value = "dark";
  } else {
    colorMode.value = "light";
  }
  $meta.cmdMenu = false;
};

const { Meta_K, Ctrl_K } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (e.key === "k" && (e.metaKey || e.ctrlKey)) e.preventDefault();
  },
});

watch([Meta_K, Ctrl_K], (v) => {
  if (v[0] || v[1]) $meta.cmdMenu = true;
});
</script>

<template>
  <Button
    size="xs"
    class="text-xs cursor-pointer hidden md:block"
    data-umami-event="command-menu"
    @click="$meta.cmdMenu = true"
  >
    <div class="i-pixelarticons:command h-4 w-4" />
  </Button>
  <Popover>
    <PopoverTrigger as-child>
      <Button
        size="xs"
        class="text-xs cursor-pointer md:hidden"
        data-umami-event="command-menu"
      >
        <div class="i-lucide-square-menu" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-72 p-0">
      <div class="flex flex-col">
        <div class="p-2">
          <div class="text-sm font-medium px-2 py-1.5">
            Actions
          </div>
          <div class="space-y-1">
            <div
              class="flex items-center px-2 py-1.5 text-sm rounded-sm hover:bg-accent cursor-pointer"
              data-umami-event="save-project"
              @click="$projects.saveProject"
            >
              <div class="i-lucide:save mr-2" />
              <span>save project</span>
            </div>
            <div
              class="flex items-center px-2 py-1.5 text-sm rounded-sm hover:bg-accent cursor-pointer"
              data-umami-event="share-project"
              @click="$projects.shareProject"
            >
              <div class="i-lucide:share mr-2" />
              <span>share</span>
            </div>
            <div
              v-if="$projects.activeProjectMeta.mode == 'console'"
              class="flex items-center px-2 py-1.5 text-sm rounded-sm hover:bg-accent cursor-pointer"
              data-umami-event="convert-to-notebook"
              @click="$projects.convertToNotebook"
            >
              <div class="i-mdi:notebook-edit-outline mr-2" />
              <span>convert to notebook</span>
            </div>
            <div
              v-if="activeProject.mode == 'notebook'"
              class="flex items-center px-2 py-1.5 text-sm rounded-sm hover:bg-accent cursor-pointer"
              data-umami-event="convert-to-console"
              @click="$projects.convertToConsole"
            >
              <div class="i-fluent:window-console-20-filled mr-2" />
              <span>convert to console</span>
            </div>
            <div
              class="flex items-center px-2 py-1.5 text-sm rounded-sm hover:bg-accent cursor-pointer"
              data-umami-event="add-sql-cell"
              @click="$projects.addCell('sql', null)"
            >
              <div class="i-hugeicons:sql mr-2" />
              <span>add sql cell</span>
            </div>
            <div
              class="flex items-center px-2 py-1.5 text-sm rounded-sm hover:bg-accent cursor-pointer"
              data-umami-event="add-markdown-cell"
              @click="$projects.addCell('markdown', null)"
            >
              <div class="i-ion:logo-markdown mr-2" />
              <span>add markdown cell</span>
            </div>
          </div>
        </div>
        <div class="h-px bg-border" />
        <div class="p-2">
          <div class="text-sm font-medium px-2 py-1.5">
            Projects
          </div>
          <div class="space-y-1">
            <div
              class="flex items-center px-2 py-1.5 text-sm rounded-sm hover:bg-accent cursor-pointer"
              @click="$router.push('/projects')"
            >
              <span>Projects</span>
            </div>
            <div
              class="flex items-center px-2 py-1.5 text-sm rounded-sm hover:bg-accent cursor-pointer"
              data-umami-event="new-project"
              @click="$projects.createProject"
            >
              <div class="i-lucide:list-plus mr-2" />
              <span>new project</span>
            </div>
            <div
              v-for="project in $projects.projects.slice(0, 3)"
              :key="project.id"
              class="flex items-center px-2 py-1.5 text-sm rounded-sm hover:bg-accent cursor-pointer"
              data-umami-event="open-project"
              @click="$projects.setActiveProject(project)"
            >
              <span class="text-muted-foreground">{{ project.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </PopoverContent>
  </Popover>
  <CommandDialog v-model:open="$meta.cmdMenu">
    <Command class="rounded-lg border shadow-md ">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList class="nice-scrollbar max-h-[30vh]">
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup
          v-if="$route.name === 'workbench'"
          heading="Actions"
        >
          <CommandItem
            value="save"
            data-umami-event="save-project"
            @select="$projects.saveProject"
          >
            <div class="i-lucide:save mr-2" />
            <span>save project</span>
          </CommandItem>
          <CommandItem
            value="share"
            data-umami-event="share-project"
            @select="$projects.shareProject"
          >
            <div class="i-lucide:share mr-2" />
            <span>share</span>
          </CommandItem>
          <CommandItem
            v-if="$projects.activeProjectMeta.mode == 'console'"
            value="convert-to-notebook"
            data-umami-event="convert-to-notebook"
            class="items-center flex"
            @select="$projects.convertToNotebook"
          >
            <div class="i-mdi:notebook-edit-outline mr-2" />
            <span>convert to notebook</span>
          </CommandItem>
          <CommandItem
            v-if="activeProject.mode == 'notebook'"
            value="convert-to-console"
            data-umami-event="convert-to-console"
            class="items-center flex"
            @select="$projects.convertToConsole"
          >
            <div class="i-fluent:window-console-20-filled mr-2" />
            <span>convert to console</span>
          </CommandItem>
          <CommandItem
            value="new-add-cell-sql"
            data-umami-event="add-sql-cell"
            class="items-center flex"
            @select="$projects.addCell('sql', null)"
          >
            <div class="i-hugeicons:sql mr-2" />
            <span>add sql cell</span>
          </CommandItem>
          <CommandItem
            value="new-add-cell-markdown"
            data-umami-event="add-markdown-cell"
            class="items-center flex"
            @select="$projects.addCell('markdown', null)"
          >
            <div class="i-ion:logo-markdown mr-2" />
            <span>add markdown cell</span>
          </CommandItem>
        </CommandGroup>
        <CommandGroup
          v-if="$route.name === 'workbench'"
          heading="Files import"
        >
          <CommandItem
            value="upload file"
            data-umami-event="start-upload-files"
            @select="$meta.startFilesImport"
          >
            <div class="i-lucide:import mr-2" />
            <span>upload file (csv, arrow, parquet)</span>
          </CommandItem>
          <CommandItem
            value="mount local filesystem"
            data-umami-event="mount-file-system"
            @select="$meta.startMountFileSystem"
          >
            <div class="i-lucide:file-stack mr-2" />
            <span>mount file system</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Projects">
          <CommandItem
            v-for="project in $projects.projects.slice(0, 3)"
            :key="project.id"
            :value="project.name"
            data-umami-event="open-project"
            @select="$projects.setActiveProject(project)"
          >
            <div class="flex justify-between items-center w-full">
              <span>{{ project.name }}</span>
            </div>
          </CommandItem>
          <CommandSeparator />
          <CommandItem
            value="list all projects"
            data-umami-event="list-projects"
            class="items-center flex"
            @select="$router.push('/projects')"
          >
            <div class="i-lucide:layout-list mr-2" />
            <span>all projects</span>
          </CommandItem>
          <CommandItem
            value="new project"
            data-umami-event="new-project"
            class="items-center flex"
            @select="$projects.createProject"
          >
            <div class="i-lucide:list-plus mr-2" />
            <span>new project</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Meta">
          <CommandItem
            v-if="colorMode == 'dark'"
            value="switch to light mode"
            data-umami-event="switch-to-light"
            @select="onColorModeToggle"
          >
            <div class="flex justify-between items-center w-full">
              <span>switch to light mode</span>
            </div>
          </CommandItem>
          <CommandItem
            v-if="colorMode == 'light'"
            value="switch to dark mode"
            data-umami-event="switch-to-dark"
            @select="onColorModeToggle"
          >
            <div class="flex justify-between items-center w-full">
              <span>switch to dark mode</span>
            </div>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  </CommandDialog>
</template>

<style scoped></style>