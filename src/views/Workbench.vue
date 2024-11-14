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
import { useMetaStore } from "@/store/meta.ts";
import { useProjects } from "@/store/project.ts";
import { useClipboard, useMagicKeys } from "@vueuse/core";
import { reactive, ref, watch } from "vue";

const $meta = useMetaStore();
const $projects = useProjects();
const shareVal = ref();

const { copy } = useClipboard({ source: $meta.shareLink });

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
    <div class="flex justify-center">

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
      <div class="flex items-stretch">
        <input type="text" class="flex-grow border-2 rounded text-sm p-1" :value="$meta.shareLink" ref="shareVal"/>
      </div>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction data-umami-event="copy-shared-link" @click="doCopy">Copy & Close</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
  <FileImport/>
  <MountFileSystem/>
</template>

<style scoped>

</style>