<script setup lang="ts">
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, } from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from "@/components/ui/button";
import { useColorMode, useMagicKeys } from "@vueuse/core";
import { watch } from "vue";
import { useMetaStore } from "@/store/meta.ts";
import { useProjects } from "@/store/project.ts";
import { useRoute, useRouter } from "vue-router";

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
  <Button size="xs" class="text-xs cursor-pointer hidden md:block" @click="$meta.cmdMenu = true"
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
        <DropdownMenuItem @select="$projects.saveProject" data-umami-event="save-project">
          <div class="i-lucide:save"></div>
          <span>save project</span>
        </DropdownMenuItem>
        <DropdownMenuItem @select="$projects.shareProject" data-umami-event="share-project">
          <div class="i-lucide:share"></div>
          <span>share</span>
        </DropdownMenuItem>
        <DropdownMenuItem value="convert-to-notebook" data-umami-event="convert-to-notebook" class="items-center flex"
          v-if="$projects.activeProjectMeta.mode == 'console'" @select="$projects.convertToNotebook">
          <div class="i-mdi:notebook-edit-outline"></div>
          <span>convert to notebook</span>
        </DropdownMenuItem>
        <DropdownMenuItem value="convert-to-console" data-umami-event="convert-to-console" class="items-center flex"
          v-if="activeProject.mode == 'notebook'" @select="$projects.convertToConsole">
          <div class="i-fluent:window-console-20-filled"></div>
          <span>convert to console</span>
        </DropdownMenuItem>
        <DropdownMenuItem value="new-add-cell-sql" data-umami-event="add-sql-cell" class="items-center flex"
          @select="$projects.addCell('sql', null)">
          <div class="i-hugeicons:sql"></div>
          <span>add sql cell</span>
        </DropdownMenuItem>
        <DropdownMenuItem value="new-add-cell-markdown" data-umami-event="add-markdown-cell" class="items-center flex"
          @select="$projects.addCell('markdown', null)">
          <div class="i-ion:logo-markdown"></div>
          <span>add markdown cell</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem @select="$router.push('/projects')">
          <span>Projects</span>
        </DropdownMenuItem>
        <DropdownMenuItem value="new project" data-umami-event="new-project" class="items-center flex"
          @select="$projects.createProject">
          <div class="i-lucide:list-plus"></div>
          <span>new project</span>
        </DropdownMenuItem>
        <DropdownMenuItem data-umami-event="open-project" v-for="project in $projects.projects.slice(0, 3)"
          @select="$projects.setActiveProject(project)">
          <div class="flex justify-between items-center w-full">
            <span class="text-muted-foreground">{{ project.name }}</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
  <CommandDialog v-model:open="$meta.cmdMenu">
    <Command class="rounded-lg border shadow-md ">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList class="nice-scrollbar max-h-[30vh]">
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Actions" v-if="$route.name === 'workbench'">

          <CommandItem value="save" @select="$projects.saveProject" data-umami-event="save-project">
            <div class="i-lucide:save mr-2"></div>
            <span>save project</span>
          </CommandItem>
          <CommandItem value="share" @select="$projects.shareProject" data-umami-event="share-project">
            <div class="i-lucide:share mr-2"></div>
            <span>share</span>
          </CommandItem>
          <CommandItem value="convert-to-notebook" data-umami-event="convert-to-notebook" class="items-center flex"
            v-if="$projects.activeProjectMeta.mode == 'console'" @select="$projects.convertToNotebook">
            <div class="i-mdi:notebook-edit-outline mr-2"></div>
            <span>convert to notebook</span>
          </CommandItem>
          <CommandItem value="convert-to-console" data-umami-event="convert-to-console" class="items-center flex"
            v-if="activeProject.mode == 'notebook'" @select="$projects.convertToConsole">
            <div class="i-fluent:window-console-20-filled mr-2"></div>
            <span>convert to console</span>
          </CommandItem>
          <CommandItem value="new-add-cell-sql" data-umami-event="add-sql-cell" class="items-center flex"
            @select="$projects.addCell('sql', null)">
            <div class="i-hugeicons:sql mr-2"></div>
            <span>add sql cell</span>
          </CommandItem>
          <CommandItem value="new-add-cell-markdown" data-umami-event="add-markdown-cell" class="items-center flex"
            @select="$projects.addCell('markdown', null)">
            <div class="i-ion:logo-markdown mr-2"></div>
            <span>add markdown cell</span>
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Files import" v-if="$route.name === 'workbench'">
          <CommandItem value="upload file" data-umami-event="start-upload-files" @select="$meta.startFilesImport">
            <div class="i-lucide:import mr-2"></div>
            <span>upload file (csv, arrow, parquet)</span>
          </CommandItem>
          <CommandItem value="mount local filesystem" data-umami-event="mount-file-system"
            @select="$meta.startMountFileSystem">
            <div class="i-lucide:file-stack mr-2"></div>
            <span>mount file system</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Projects">
          <CommandItem :value="project.name" data-umami-event="open-project"
            v-for="project in $projects.projects.slice(0, 3)" @select="$projects.setActiveProject(project)">
            <div class="flex justify-between items-center w-full">
              <span>{{ project.name }}</span>
            </div>
          </CommandItem>
          <CommandSeparator />
          <CommandItem value="list all projects" data-umami-event="list-projects" class="items-center flex"
            @select="$router.push('/projects')">
            <div class="i-lucide:layout-list mr-2"></div>
            <span>all projects</span>
          </CommandItem>
          <CommandItem value="new project" data-umami-event="new-project" class="items-center flex"
            @select="$projects.createProject">
            <div class="i-lucide:list-plus mr-2"></div>
            <span>new project</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Meta">
          <CommandItem value="switch to light mode" v-if="colorMode == 'dark'" data-umami-event="switch-to-light"
            @select="onColorModeToggle">
            <div class="flex justify-between items-center w-full">
              <span>switch to light mode</span>
            </div>
          </CommandItem>
          <CommandItem value="switch to dark mode" v-if="colorMode == 'light'" data-umami-event="switch-to-dark"
            @select="onColorModeToggle">
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