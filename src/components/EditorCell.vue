<script setup lang="ts">
import {Textarea} from "@/components/ui/textarea";
import EditorCellToolbar from "@/components/EditorCellToolbar.vue";
import {computed, onMounted, ref} from "vue";
import {useDuckDb} from "@/hooks/useDuckDb.ts";
import {$ref} from 'unplugin-vue-macros/macros';
import "https://cdn.jsdelivr.net/npm/@finos/perspective-viewer@3.1.3/dist/cdn/perspective-viewer.js";
import "https://cdn.jsdelivr.net/npm/@finos/perspective-viewer-datagrid@3.1.3/dist/cdn/perspective-viewer-datagrid.js";
import "https://cdn.jsdelivr.net/npm/@finos/perspective-viewer-d3fc@3.1.3/dist/cdn/perspective-viewer-d3fc.js";
import "@finos/perspective-viewer/dist/css/pro.css";
import "@finos/perspective-viewer/dist/css/pro-dark.css";

//@ts-ignore
import perspective from "https://cdn.jsdelivr.net/npm/@finos/perspective/dist/cdn/perspective.js";

import {arrowTypeToJsType} from "@/lib/utils.ts";
import {db_events} from "@/store/meta.ts";
import {useColorMode, useVModels} from "@vueuse/core";
import {useProjects} from "@/store/project.ts";

const pView = ref(null)
const color = useColorMode()
const props = defineProps({
  mode: {default: 'console', type: String},
  query: {type: String, default: 'select 1+1 as result;'},
  id: {type: Number, required: true},
  position: {type: Number, required: true},
})
const {query} = useVModels(props);


const {db, loading: db_loading, ready} = useDuckDb()
const $projects = useProjects()
let queryEditorRef = $ref(null);
let results: any = $ref(null);
let error: any = $ref('');
let pWorker = $ref(null);
let inputFocused = $ref(false);
let lastQueryDuration = $ref('')
let loading = $ref(false);
// -- start computed --

const tableTheme = computed(() => {
  if (color.value === 'light') {
    return ''
  } else {
    return 'Pro Dark'
  }
})
// -- end computed --


// -- start methods --
const onClear = async () => {
  results = ''
  error = '';
}


const onPlay = async () => {
  if (!inputFocused) return;
  if (!db.value) return;
  if (!pWorker) return;
  await ready;
  error = '';

  const c = await db.value.connect();
  try {
    loading = true;
    let start = performance.now()
    results = await c.query(query.value)

    const mappedFields = results.schema.fields.reduce((acc: Record<string, string>, next: Record<string, any>) => {
      acc = acc ?? {};
      acc[next?.name] = arrowTypeToJsType(next.type);
      return acc;
    }, {})
    results = JSON.parse(
        JSON.stringify(
            results.toArray(),
            (_, value) => (typeof value === 'bigint' ? value.toString() : value) // return everything else unchanged
        )
    )
    //@ts-ignore
    const table = await pWorker.table(mappedFields);
    table.update(results)
    //@ts-ignore
    pView.value.load(table, {configure: true});
    let end = performance.now()

    lastQueryDuration = ((end - start) / 1000).toFixed(5);
    db_events.emit('UPDATE_SCHEMA')
  } catch (e) {
    if (e instanceof Error) {
      error = e.toString();
    } else {
      error = 'An unknown error occured'
    }
  } finally {
    loading = false;
  }
}

// -- end methods --

onMounted(async () => {
  pWorker = await perspective.worker();
})

</script>

<template>
  <div :class="[
    'transition-all duration-200 w-full flex h-auto flex-col p-3 rounded space-y-2',
    props.mode == 'console' ? 'h-full' : 'border-[2px] border-solid border-slate-200 hover:shadow-md focus-within:border-slate-400 focus-within:shadow-lg',
  ]"
       @focusin="inputFocused = true" @focusout="inputFocused = false"
  >
    <EditorCellToolbar :delete="props.mode == 'notebook'"
                       :trash="props.mode == 'notebook'"
                       :duplicate="props.mode == 'notebook'"
                       @play="onPlay" @clear="onClear"
                       @movedown="$projects.moveDown(props.id, props.position)"
                       @moveup="$projects.moveUp(props.id, props.position)"
                       @trash="$projects.deleteCell(props.id)"
                       :display_results="false"/>
    <div class="flex items-start">
      <Textarea tabindex="-1" class="max-h-[40vh] p-2 border-2 focus:border-slate-300 rounded" v-model:model-value="query"
                ref="queryEditorRef" :disabled="db_loading"
                style="field-sizing: content"/>
      <div v-if="error" class="w-1/3 text-sm text-red-500 px-4">
        {{ error }}
      </div>
    </div>

    <div class="bg-blue-200 flex-grow" v-show="results?.length">
      <perspective-viewer ref="pView" :class="[
        'overflow-hidden',
        props.mode=='console' ? 'h-full' : 'h-[20vh] resize-y'
      ]"
                          :theme="tableTheme"></perspective-viewer>
    </div>
    <div class="info justify-end flex space-x-2">
      <span class="text-xs" v-if="results && !error">query took: {{ lastQueryDuration }} s</span>
      <span class="text-xs" v-if="!!results && !error">{{ error }}</span>
      <div class="i-ep:success-filled text-green-600 h-5 w-5" v-if="!!results && !error"></div>
      <div class="i-material-symbols:chat-error-outline text-red-600 h-5 w-5" v-if="!!error"></div>
      <div class="i-line-md:loading-twotone-loop h-5 w-5" v-if="loading"></div>
    </div>
  </div>
</template>

<style scoped></style>