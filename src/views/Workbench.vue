<script setup lang="ts">
import DBSchemaDetails from "@/components/DBSchemaDetails.vue";
import EditorCell from "@/components/EditorCell.vue";
import FileImport from "@/components/FileImport.vue";
import MarkdownCell from "@/components/MarkdownCell.vue";
import MountFileSystem from "@/components/MountFileSystem.vue";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {useMetaStore} from "@/store/meta.ts";
import {useProjects} from "@/store/project.ts";
import {useClipboard, useMagicKeys} from "@vueuse/core";
import {reactive, ref, watch} from "vue";
import {useDuckDb} from "@/hooks/useDuckDb.ts";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";
import NotificationsCard from "@/components/NotificationsCard.vue";
import {Input} from "@/components/ui/input";
import {Popover, PopoverContent, PopoverTrigger,} from '@/components/ui/popover'
import SQLBackendSelector from "@/components/SQLBackendSelector.vue";

const $meta = useMetaStore();
const $projects = useProjects();
const shareVal = ref();

const {copy} = useClipboard({source: $meta.shareLink});
const {loading: db_loading} = useDuckDb();
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

const doCopy = async () => {
  await copy($meta.shareLink);
  $meta.shareLink = "";
};
</script>

<template>
  <div class="flex flex-grow w-1/3 flex-col h-full max-h-full px-2  py-0">
    <div class="flex justify-start items-center gap-2 text-gray-400 py-4">
      <div v-if="db_loading" class="flex items-center justify-center w-full">
        <div class="i-line-md:loading-twotone-loop w-5 h-5"></div>
        initializing duck db ❤️‍🔥
      </div>
      <div v-else class="flex gap-2 items-center">
        <div class="flex flex-grow space-x-2 items-center">
          <Input v-model:model-value="$projects.activeProject.value.name"
                 v-if="$route.name === 'workbench'"
                 class="max-w-[400px] border-slate-200  bg-slate-200 dark:bg-slate-500 text-center focus:bg-slate-100 dark:focus:bg-slate-900"/>
          <NotificationsCard v-if="$route.name === 'workbench'"/>
        </div>
        <Button variant="outline" size="sm">
          <div class="i-ion:logo-markdown w-4 h-4 mr-2"></div>
          add markdown
        </Button>
        <Button variant="outline" size="sm">
          <div class="i-tabler:file-type-sql w-4 h-4 mr-2"></div>

          add sql
        </Button>
        <Button variant="outline" size="sm">
          <div class="i-pixelarticons:open w-4 h-4 mr-2"></div>
          share
        </Button>
        <div class="flex flex-grow"></div>

        <Popover>
          <PopoverTrigger as-child>
            <Button variant="outline" size="sm">
              <div class="i-material-symbols:settings-cinematic-blur-outline-rounded w-4-h-4 mr-2"></div>
              sql backend
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-80">
            <SQLBackendSelector/>
          </PopoverContent>
        </Popover>
      </div>
    </div>

    <div class="overflow-y-scroll nice-scrollbar flex flex-col h-0 flex-grow space-y-6 pb-[200px]">
      <div v-for="cell in $projects.sortedCells.value" :key="`${cell.position}-${cell.id}`" v-if="$projects.activeProject.value.mode == 'notebook'" class="w-full">
        <EditorCell :mode="$projects.activeProject.value.mode" v-model:query="cell.query" :id="cell.id" :position="cell.position" v-if="cell.type == 'sql'"/>
        <MarkdownCell :mode="$projects.activeProject.value.mode" v-model:markdown="cell.markdown" :id="cell.id" :position="cell.position" v-if="cell.type == 'markdown'"/>
      </div>
      <EditorCell v-if="$projects.activeProject.value.mode == 'console'" :mode="$projects.activeProject.value.mode"
                  :id="$projects.activeProject.value.cells[0].id"
                  :position="$projects.activeProject.value.cells[0].position"
                  v-model:query="$projects.activeProject.value.cells[0].query"/>
    </div>
  </div>
  <div :class="[
            'tool-bar items-center flex flex-col space-y-3 overflow-y-scroll nice-scrollbar h-full',
            $meta.showToolbar ? 'flex-grow w-[max(20vw,350px)] max-w-[max(20vw,350px)]' : 'w-0 opacity-0'
        ]">
    <div class="overflow-y-scroll nice-scrollbar h-0 flex-grow w-full">
      <DBSchemaDetails class="w-full"/>
    </div>
  </div>
  <AlertDialog :open="$meta.shareLink != ''">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Share project</AlertDialogTitle>
        <AlertDialogDescription>
          {{ $projects.activeProject.value.name }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <div class="flex flex-col items-stretch">
        <input type="text" class="flex-grow border-2 rounded text-sm p-1" :value="$meta.shareLink" ref="shareVal"/>
        <Alert variant="destructive" class="mt-5" v-if="$meta.shareLink.length > 2048">

          <AlertTitle class="flex">
            <div class="i-mdi:exclamation-thick w-4 h-4"></div>
            <span>Generated url looks a bit too long.</span>
          </AlertTitle>
          <AlertDescription>
            This is fully based on the content of your cells. Check if you can reduce that a bit or try splitting it in different projects.
            Limit: 2048. Current: {{ $meta.shareLink.length }}
          </AlertDescription>
        </Alert>
      </div>
      <AlertDialogFooter>
        <AlertDialogCancel @click="$meta.shareLink = ''">Cancel</AlertDialogCancel>
        <AlertDialogAction data-umami-event="copy-shared-link" @click="doCopy" v-if="$meta.shareLink.length <= 2048">Copy & Close</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
  <FileImport/>
  <MountFileSystem/>
</template>

<style scoped>

</style>