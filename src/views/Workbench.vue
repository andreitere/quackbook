<script setup lang="ts">

import DBSchemaDetails from "@/components/DBSchemaDetails.vue";
import EditorCell from "@/components/EditorCell.vue";
import {useMagicKeys} from '@vueuse/core'
import {useMetaStore} from "@/store/meta.ts";
import {useProjects} from "@/store/project.ts";
import {reactive, watch} from "vue";
import MarkdownCell from "@/components/MarkdownCell.vue";

const $meta = useMetaStore()
const $projects = useProjects();


const show = reactive({
  toolBar: false,
  utilsBar: false,
})

const keys = useMagicKeys();

const cmdShiftE = keys['Option+Shift+E'];


watch(cmdShiftE, (v) => {
  if (!v) return;
  console.log(`cmdShiftE`, v);
  show.toolBar = !show.toolBar;
})

</script>

<template>
  <div class="flex flex-grow flex-col h-full max-h-full px-2  py-4">
    <div class="flex justify-center" >

    </div>
    <div class="overflow-y-scroll nice-scrollbar flex flex-col h-0 flex-grow space-y-6">
      <div v-for="cell in $projects.sortedCells.value" v-if="$projects.activeProject.value.mode == 'notebook'" class="w-full">
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
            $meta.showToolbar ? 'w-1/3' : 'w-0 opacity-0'
        ]">
    <div class="overflow-y-scroll h-0 flex-grow w-full">
      <DBSchemaDetails class="w-full"/>
    </div>
  </div>
</template>

<style scoped>

</style>