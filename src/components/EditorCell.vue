<script setup lang="ts">
import {Textarea} from "@/components/ui/textarea";
import EditorCellToolbar from "@/components/EditorCellToolbar.vue";
import {computed, onMounted, ref} from "vue";
import {useDuckDb} from "@/hooks/useDuckDb.ts";
import {$ref} from 'unplugin-vue-macros/macros';
import "https://cdn.jsdelivr.net/npm/@finos/perspective-viewer@3.1.3/dist/cdn/perspective-viewer.js";
import "https://cdn.jsdelivr.net/npm/@finos/perspective-viewer-datagrid@3.1.3/dist/cdn/perspective-viewer-datagrid.js";
import "https://cdn.jsdelivr.net/npm/@finos/perspective-viewer-d3fc@3.1.3/dist/cdn/perspective-viewer-d3fc.js";
// import "@finos/perspective-viewer/dist/css/pro.css";
import "@finos/perspective-viewer/dist/css/pro-dark.css";

import perspective from "https://cdn.jsdelivr.net/npm/@finos/perspective/dist/cdn/perspective.js";
import {arrowTypeToJsType} from "@/lib/utils.ts";
import {useSnippets} from "@/store/snippets.ts";
import {db_events} from "@/store/meta.ts";
import {useColorMode} from "@vueuse/core";


const pView = ref(null)
const color = useColorMode()
const props = defineProps({
  singleMode: {default: true, type: Boolean},
  fillWH: {default: false, type: Boolean},
})

const {db, loading: db_loading, error: db_err, ready} = useDuckDb()
const $snippets = useSnippets()


let query = $ref("SELECT * FROM 'https://shell.duckdb.org/data/tpch/0_01/parquet/orders.parquet';");
let queryEditorRef = $ref(null);
let results: any = $ref(null);
let error: any = $ref('');
let pWorker = $ref(null);
let inputFocused = $ref(false);


// -- start computed --

const tableTheme = computed(() => {
  if(color.value === 'light') {
    return ''
  } else {
    return 'Pro Dark'
  }
})
// -- end computed --


// -- start methods --
const onClear = async () => {
  query = ''
}

const onSave = async () => {

}

const onPlay = async () => {
  await ready;
  error = '';
  const c = await db.value?.connect();
  try {
    let r = await c.query(query)
    // console.log(typeof results, results)
    results = r;
    const mappedFields = results.schema.fields.reduce((acc: Record<string, string>, next: unknown) => {
      acc = acc ?? {};
      acc[next?.name] = arrowTypeToJsType(next?.type);
      return acc;
    }, {})
    results = JSON.parse(
        JSON.stringify(
            results.toArray(),
            (_, value) => (typeof value === 'bigint' ? value.toString() : value) // return everything else unchanged
        )
    )


    console.log(mappedFields)
    const table = await pWorker.table(mappedFields);
    table.update(results)
    pView?.value.load(table, {configure: true});
    db_events.emit('UPDATE_SCHEMA')
  } catch (e) {
    error = e.message;
  }
}

// -- end methods --

onMounted(async () => {
  pWorker = await perspective.worker();
  console.log(pView._value)
})

</script>

<template>
  <div :class="[
    'transition-all duration-200 w-full flex h-auto flex-col p-3 rounded space-y-2 border-[1px] border-solid border-gray-100 hover:shadow-md focus-within:shadow-md',
    props.singleMode ? 'h-full' : '',
  ]">
    <EditorCellToolbar :delete="!props.singleMode" @play="onPlay" @clear="onClear"/>
    <div class="flex items-start">
      <Textarea class="max-h-[40vh] p-2 border-2 focus:border-slate-700 rounded" v-model.lazy="query"
                ref="queryEditorRef" :disabled="db_loading" @focusin="inputFocused = true" @blur="inputFocused = false"
                style="field-sizing: content"/>
      <div v-if="error" class="w-1/3 text-sm text-red-500 px-4">
        {{ error }}
      </div>
    </div>

    <div class="bg-blue-200 flex-grow" v-show="results?.length">
      <perspective-viewer ref="pView" :class="[
        'overflow-auto',
        props.singleMode ? 'h-full' : 'h-[20vh] resize-y'
      ]"
                          :theme="tableTheme"></perspective-viewer>
    </div>
  </div>
</template>

<style scoped></style>