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
    class="text-xs cursor-pointer hidden md:block transition-all duration-200 hover:scale-105"
    data-umami-event="command-menu"
    @click="$meta.cmdMenu = true"
  >
    <div class="i-pixelarticons:command h-4 w-4" />
  </Button>
  <Popover>
    <PopoverTrigger as-child>
      <Button
        size="xs"
        class="text-xs cursor-pointer md:hidden transition-all duration-200 hover:scale-105"
        data-umami-event="command-menu"
      >
        <div class="i-lucide-square-menu" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-72 p-0 shadow-lg border-0">
      <div class="flex flex-col">
        <div class="p-3">
          <div class="text-sm font-semibold px-2 py-1.5 text-muted-foreground">
            Actions
          </div>
          <div class="space-y-1">
            <div
              class="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent/50 cursor-pointer transition-colors duration-200"
              data-umami-event="save-project"
              @click="$projects.saveProject"
            >
              <div class="i-lucide:save mr-2 text-primary" />
              <span>Save Project</span>
            </div>
            <div
              class="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent/50 cursor-pointer transition-colors duration-200"
              data-umami-event="share-project"
              @click="$projects.shareProject"
            >
              <div class="i-lucide:share mr-2 text-primary" />
              <span>Share</span>
            </div>
            <div
              class="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent/50 cursor-pointer transition-colors duration-200"
              data-umami-event="add-sql-cell"
              @click="$projects.addCell('sql', null)"
            >
              <div class="i-hugeicons:sql mr-2 text-primary" />
              <span>Add SQL Cell</span>
            </div>
            <div
              class="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent/50 cursor-pointer transition-colors duration-200"
              data-umami-event="add-markdown-cell"
              @click="$projects.addCell('markdown', null)"
            >
              <div class="i-ion:logo-markdown mr-2 text-primary" />
              <span>Add Markdown Cell</span>
            </div>
          </div>
        </div>
        <div class="h-px bg-border/50" />
        <div class="p-3">
          <div class="text-sm font-semibold px-2 py-1.5 text-muted-foreground">
            Projects
          </div>
          <div class="space-y-1">
            <div
              class="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent/50 cursor-pointer transition-colors duration-200"
              @click="$router.push('/projects')"
            >
              <div class="i-lucide:layout-list mr-2 text-primary" />
              <span>All Projects</span>
            </div>
            <div
              class="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent/50 cursor-pointer transition-colors duration-200"
              data-umami-event="new-project"
              @click="$projects.createProject"
            >
              <div class="i-lucide:list-plus mr-2 text-primary" />
              <span>New Project</span>
            </div>
            <div
              v-for="project in $projects.projects.slice(0, 3)"
              :key="project.id"
              class="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent/50 cursor-pointer transition-colors duration-200"
              data-umami-event="open-project"
              @click="$projects.setActiveProject(project)"
            >
              <div class="i-lucide:file-text mr-2 text-primary" />
              <span class="text-muted-foreground">{{ project.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </PopoverContent>
  </Popover>
  <CommandDialog v-model:open="$meta.cmdMenu">
    <Command
      class="rounded-lg border shadow-lg bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <CommandInput
        placeholder="Type a command or search..."
        class="border-0 focus:ring-0"
      />
      <CommandList class="nice-scrollbar max-h-[30vh]">
        <CommandEmpty class="py-6 text-center text-sm text-muted-foreground">
          No results found.
        </CommandEmpty>
        <CommandGroup
          v-if="$route.name === 'workbench'"
          heading="Actions"
        >
          <CommandItem
            value="save"
            data-umami-event="save-project"
            class="px-3 py-2 cursor-pointer transition-colors duration-200"
            @select="$projects.saveProject"
          >
            <div class="i-lucide:save mr-2 text-primary" />
            <span>Save Project</span>
          </CommandItem>
          <CommandItem
            value="share"
            data-umami-event="share-project"
            class="px-3 py-2 cursor-pointer transition-colors duration-200"
            @select="$projects.shareProject"
          >
            <div class="i-lucide:share mr-2 text-primary" />
            <span>Share</span>
          </CommandItem>
          <CommandItem
            value="new-add-cell-sql"
            data-umami-event="add-sql-cell"
            class="px-3 py-2 cursor-pointer transition-colors duration-200"
            @select="$projects.addCell('sql', null)"
          >
            <div class="i-hugeicons:sql mr-2 text-primary" />
            <span>Add SQL Cell</span>
          </CommandItem>
          <CommandItem
            value="new-add-cell-markdown"
            data-umami-event="add-markdown-cell"
            class="px-3 py-2 cursor-pointer transition-colors duration-200"
            @select="$projects.addCell('markdown', null)"
          >
            <div class="i-ion:logo-markdown mr-2 text-primary" />
            <span>Add Markdown Cell</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Projects">
          <CommandItem
            value="list all projects"
            data-umami-event="list-projects"
            class="px-3 py-2 cursor-pointer transition-colors duration-200"
            @select="$router.push('/projects')"
          >
            <div class="i-lucide:layout-list mr-2 text-primary" />
            <span>All Projects</span>
          </CommandItem>
          <CommandItem
            value="new project"
            data-umami-event="new-project"
            class="px-3 py-2 cursor-pointer transition-colors duration-200"
            @select="$projects.createProject"
          >
            <div class="i-lucide:list-plus mr-2 text-primary" />
            <span>New Project</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Meta">
          <CommandItem
            v-if="colorMode == 'dark'"
            value="switch to light mode"
            data-umami-event="switch-to-light"
            class="px-3 py-2 cursor-pointer transition-colors duration-200"
            @select="onColorModeToggle"
          >
            <div class="flex justify-between items-center w-full">
              <div class="flex items-center">
                <div class="i-lucide:sun mr-2 text-primary" />
                <span>Switch to Light Mode</span>
              </div>
            </div>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  </CommandDialog>
</template>

<style scoped>
.nice-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: hsl(var(--border)) transparent;
}

.nice-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.nice-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.nice-scrollbar::-webkit-scrollbar-thumb {
  background-color: hsl(var(--border));
  border-radius: 3px;
}

.nice-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: hsl(var(--border) / 0.8);
}
</style>