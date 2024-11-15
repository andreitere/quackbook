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
  <div class="flex flex-grow w-1/3 flex-col h-full max-h-full px-2  py-4">
    <div class="flex justify-center items-center gap-2 text-gray-400 py-4" v-if="db_loading">
      <div class="i-line-md:loading-twotone-loop w-5 h-5"></div>
      initializing duck db ❤️‍🔥
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