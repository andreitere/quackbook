<script setup lang="ts">
import {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";

import { useColorMode, useMagicKeys } from "@vueuse/core";
import { watch } from "vue";
import { useMetaStore } from "@/store/meta.ts";
import { useProjects } from "@/store/project.ts";
import { useRouter } from "vue-router";

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
const $router = useRouter();

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
  <CommandDialog v-model:open="$meta.cmdMenu">
    <Command class="rounded-lg border shadow-md ">
      <CommandInput placeholder="Type a command or search..."/>
      <CommandList class="max-h-[60vh]">
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Actions">

          <CommandItem value="save" @select="$projects.saveProject" data-umami-event="save-project">
            <div class="i-pixelarticons:save w-4 h-4 mr-2"></div>
            <span>save project</span>
          </CommandItem>
          <CommandItem value="share" @select="$projects.shareProject" data-umami-event="share-project">
            <div class="i-pixelarticons:open w-4 h-4 mr-2"></div>
            <span>share</span>
          </CommandItem>
          <CommandItem value="convert-to-notebook" data-umami-event="convert-to-notebook" class="items-center flex"
                       v-if="$projects.activeProject.value.mode == 'console'"
                       @select="$projects.convertToNotebook">
            <div class="i-mdi:notebook-edit-outline w-4 h-4 mr-2"></div>
            <span>convert to notebook</span>
          </CommandItem>
          <CommandItem value="convert-to-console" data-umami-event="convert-to-console" class="items-center flex"
                       v-if="$projects.activeProject.value.mode == 'notebook'"
                       @select="$projects.convertToConsole">
            <div class="i-fluent:window-console-20-filled w-4 h-4 mr-2"></div>
            <span>convert to console</span>
          </CommandItem>
          <CommandItem value="new-add-cell-sql" data-umami-event="add-sql-cell" class="items-center flex"
                       @select="$projects.addCell('sql', null)">
            <div class="i-material-symbols:sheets-add-on w-4 h-4 mr-2"></div>
            <span>add sql cell</span>
          </CommandItem>
          <CommandItem value="new-add-cell-markdown" data-umami-event="add-markdown-cell" class="items-center flex"
                       @select="$projects.addCell('markdown', null)">
            <div class="i-ion:logo-markdown w-4 h-4 mr-2"></div>
            <span>add markdown cell</span>
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Files import">
          <CommandItem value="import file" data-umami-event="start-import-files" @select="$meta.startFilesImport">
            <div class="i-pixelarticons:calendar-import w-4 h-4 mr-2"></div>
            <span>import file (csv, arrow, parquet)</span>
          </CommandItem>
          <CommandItem value="mount local filesystem" data-umami-event="mount-file-system"
                       @select="$meta.startMountFileSystem">
            <div class="i-eos-icons:file-system-outlined w-4 h-4 mr-2"></div>
            <span>mount file system</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator/>
        <CommandGroup heading="Projects">
<!--          <CommandItem :value="project.name" data-umami-event="open-project"-->
<!--                       v-for="project in $projects.projects.value.slice(0,3)"-->
<!--                       @select="$projects.setActiveProject(project)">-->
<!--            <div class="flex justify-between items-center w-full">-->
<!--              <span>{{ project.name }}</span>-->
<!--            </div>-->
<!--          </CommandItem>-->
          <CommandSeparator/>
          <CommandItem value="list all projects" data-umami-event="list-projects" class="items-center flex"
                       @select="$router.push('/projects')">
            <div class="i-ic:baseline-menu-book w-4 h-4 mr-2"></div>
            <span>all projects</span>
          </CommandItem>
          <CommandItem value="new project" data-umami-event="new-project" class="items-center flex"
                       @select="$emit('new-project')">
            <div class="i-pixelarticons:briefcase-plus w-4 h-4 mr-2"></div>
            <span>new project</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator/>
        <CommandGroup heading="Navigation">
          <CommandItem value="home" data-umami-event="home" @select="$router.push('/')">
            <div class="flex justify-between items-center w-full">
              <span>home</span>
            </div>
          </CommandItem>
          <CommandItem value="about" data-umami-event="about" @select="$router.push('/about')">
            <div class="flex justify-between items-center w-full">
              <span>about</span>
            </div>
          </CommandItem>

        </CommandGroup>
        <CommandGroup heading="Meta">
          <CommandItem value="switch to light mode"
                       v-if="colorMode == 'dark'"
                       data-umami-event="switch-to-light"
                       @select="onColorModeToggle">
            <div class="flex justify-between items-center w-full">
              <span>switch to light mode</span>
            </div>
          </CommandItem>
          <CommandItem value="switch to dark mode"
                       v-if="colorMode == 'light'"
                       data-umami-event="switch-to-dark"
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

<style scoped>

</style>