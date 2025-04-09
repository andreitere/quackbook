<script setup lang="ts">

import { useDuckDb } from "@/hooks/useDuckDb.ts";
import { useMetaStore } from "@/store/meta.ts";
import { useProjects } from "@/store/project.ts";
import { useMagicKeys } from "@vueuse/core";
import { reactive, watch } from "vue";

const $meta = useMetaStore();
const $projects = useProjects();

const { loading: db_loading } = useDuckDb();
const show = reactive({
  toolBar: true,
  utilsBar: false,
});

const keys = useMagicKeys();

const cmdShiftE = keys["Option+Shift+E"];

watch(cmdShiftE, (v) => {
  if (!v) return;
  show.toolBar = !show.toolBar;
});

</script>

<template>
  <div class="flex flex-grow w-1/3 flex-col h-full max-h-full px-2 py-0 bg-slate-50 dark:bg-slate-800">
    <div class="flex justify-start items-center gap-2 text-gray-600 dark:text-gray-300 py-4">
      <div v-if="db_loading" class="flex items-center justify-center w-full">
        <div class="i-line-md:loading-twotone-loop w-5 h-5"></div>
        initializing duck db ❤
      </div>
      <div v-else class="flex gap-2 items-center w-full flex-col md:flex-row">
        <div class="flex flex-shrink space-x-2 w-full md:w-auto items-center">
          <EditableProjectName v-if="$route.name === 'workbench'" />
          <NotificationsCard v-if="$route.name === 'workbench'" />
          <Popover>
            <PopoverTrigger as-child>
              <Button variant="outline" size="sm" class="shadow-sm">
                <div class="i-material-symbols:settings-cinematic-blur-outline-rounded w-4-h-4"></div>
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-80">
              <SQLBackendSelector />
            </PopoverContent>
          </Popover>
        </div>
        <div class="flex flex-grow"></div>
        <div class="flex md:min-w-0 max-w-[100vw] flex-grow px-2 md:px-0 w-full">
          <div class="overflow-x-scroll min-w-full nice-scrollbar flex space-x-2 items-center md:justify-end">
            <Button class="flex-grow md:flex-grow-0 shadow-sm" variant="outline" size="sm"
              @click="$projects.addCell('markdown', null)">
              <div class="i-ion:logo-markdown"></div>
              <span class="ml-1 hidden md:block">add md</span>
            </Button>

            <Button class="flex-grow md:flex-grow-0 shadow-sm" variant="outline" size="sm"
              @click="$projects.addCell('sql', null)">
              <div class="i-hugeicons:sql"></div>
              <span class="ml-1 hidden md:block">add sql</span>
            </Button>
            <Button class="flex-grow md:flex-grow-0 shadow-sm" variant="outline" size="sm"
              @click="$projects.saveProject">
              <div class="i-lucide:save"></div>
              <span class="ml-1 hidden md:block">save</span>
            </Button>
            <Button class="flex-grow md:flex-grow-0 shadow-sm" variant="outline" size="sm"
              @click="$projects.shareProject">
              <div class="i-lucide:share"></div>
              <span class="ml-1 hidden md:block">share</span>
            </Button>
          </div>
        </div>
      </div>
    </div>

    <div class="overflow-y-scroll nice-scrollbar flex flex-col h-0 flex-grow space-y-6 pb-[200px] px-5">
      <div v-for="cell in $projects.sortedCells" :key="`${cell.position}-${cell.id}`"
        v-if="$projects.activeProjectMeta.mode == 'notebook'" class="w-full">
        <EditorCell v-model:query="cell.query" :id="cell.id" :position="cell.position" v-if="cell.type == 'sql'" />
        <MarkdownCell v-model:markdown="cell.markdown" :id="cell.id" :position="cell.position"
          v-if="cell.type == 'markdown'" />
      </div>
    </div>
  </div>
  <div :class="[
    'tool-bar items-center flex flex-col space-y-3 h-full',
    $meta.showToolbar ? 'flex-grow w-[max(450px)] max-w-[max(450px)]' : 'w-0 opacity-0'
  ]">
    <DBSchemaDetails class="w-full" />
  </div>
  <ShareProjectModal />
  <FileImport />
  <MountFileSystem />
</template>

<style scoped>
.nice-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.nice-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.nice-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.dark .nice-scrollbar::-webkit-scrollbar-thumb {
  background: #475569;
}
</style>