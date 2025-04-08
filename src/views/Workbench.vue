<script setup lang="ts">
import DBSchemaDetails from "@/components/DBSchemaDetails.vue";
import EditorCell from "@/components/EditorCell.vue";
import FileImport from "@/components/FileImport.vue";
import MarkdownCell from "@/components/MarkdownCell.vue";
import MountFileSystem from "@/components/MountFileSystem.vue";

import NotificationsCard from "@/components/NotificationsCard.vue";
import SQLBackendSelector from "@/components/SQLBackendSelector.vue";
import ShareProjectModal from "@/components/ShareProjectModal.vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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

// onMounted(() => {
//   // doMount();
// })

// const doMount = async () => {
//   const opfsRoot = await navigator.storage.getDirectory();
//   const fileHandle = await opfsRoot.getFileHandle("output.csv", {
//     create: true,
//   });
//   console.log(fileHandle);
//   console.log(opfsRoot);
//   const docsDir = await opfsRoot.getDirectoryHandle("docs", { create: true });
//   for await (const [name, handle] of docsDir) {
//     console.log(name, handle);
//   }
// };
</script>

<template>
  <div class="flex flex-grow w-1/3 flex-col h-full max-h-full px-2  py-0 ">
    <div class="flex justify-start items-center gap-2 text-gray-400 py-4">
      <div v-if="db_loading" class="flex items-center justify-center w-full">
        <div class="i-line-md:loading-twotone-loop w-5 h-5"></div>
        initializing duck db ❤
      </div>
      <div v-else class="flex gap-2 items-center w-full flex-col md:flex-row">
        <div class="flex  flex-shrink space-x-2 w-full md:w-auto items-center ">
          <Input v-model:model-value="$projects.activeProjectMeta.name" v-if="$route.name === 'workbench'"
            class="md:min-w-[300px] flex-grow md:flex-grow-0 border-slate-200  bg-slate-200 dark:bg-slate-500 text-center focus:bg-slate-100 dark:focus:bg-slate-900" />
          <NotificationsCard v-if="$route.name === 'workbench'" />
          <!-- <Button variant="outline" @click="doMount">mount</Button>-->
          <Popover>
            <PopoverTrigger as-child>
              <Button variant="outline" size="sm">
                <div class="i-material-symbols:settings-cinematic-blur-outline-rounded w-4-h-4"></div>
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-80">
              <SQLBackendSelector />
            </PopoverContent>
          </Popover>
        </div>
        <div class="flex flex-grow"></div>
        <div class="flex md:min-w-0 max-w-[100vw] flex-grow  px-2 md:px-0 w-full">
          <div class="overflow-x-scroll min-w-full nice-scrollbar flex space-x-2 items-center md:justify-end">
            <Button class="flex-grow md:flex-grow-0" variant="outline" size="sm"
              @click="$projects.addCell('markdown', null)">
              <div class="i-ion:logo-markdown"></div>
              <span class="ml-1 hidden md:block">add md</span>
            </Button>

            <Button class="flex-grow md:flex-grow-0" variant="outline" size="sm"
              @click="$projects.addCell('sql', null)">
              <div class="i-hugeicons:sql"></div>
              <span class="ml-1 hidden md:block">add sql</span>
            </Button>
            <Button class="flex-grow md:flex-grow-0" variant="outline" size="sm" @click="$projects.saveProject">
              <div class="i-lucide:save"></div>
              <span class="ml-1 hidden md:block">save</span>
            </Button>
            <Button class="flex-grow md:flex-grow-0" variant="outline" size="sm" @click="$projects.shareProject">
              <div class="i-lucide:share"></div>
              <span class="ml-1 hidden md:block">share</span>
            </Button>
          </div>
        </div>
      </div>
    </div>

    <div class="overflow-y-scroll nice-scrollbar flex flex-col h-0 flex-grow space-y-6"
      style="scroll-snap-type: y mandatory;">
      <div v-for="cell in $projects.sortedCells" :key="`${cell.position}-${cell.id}`"
        v-if="$projects.activeProjectMeta.mode == 'notebook'" class="w-full" style="scroll-snap-align: start;">
        <EditorCell :mode="$projects.activeProjectMeta.mode" v-model:query="cell.query" :id="cell.id"
          :position="cell.position" v-if="cell.type == 'sql'" />
        <MarkdownCell :mode="$projects.activeProjectMeta.mode" v-model:markdown="cell.markdown" :id="cell.id"
          :position="cell.position" v-if="cell.type == 'markdown'" />
      </div>
      <EditorCell v-if="$projects.activeProjectMeta.mode == 'console'" :mode="$projects.activeProjectMeta.mode"
        :id="$projects.activeProjectCells[0].id" :position="$projects.activeProjectCells[0].position"
        v-model:query="$projects.activeProjectCells[0].query" />
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

<style scoped></style>