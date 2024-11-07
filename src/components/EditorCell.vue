<script setup lang="ts">
import { Textarea } from "@/components/ui/textarea";
import EditorCellToolbar from "@/components/EditorCellToolbar.vue";
import { onMounted, ref } from "vue";
import { useDuckDb } from "@/hooks/useDuckDb.ts";
import { $ref } from 'unplugin-vue-macros/macros';
import { tableFromIPC } from 'apache-arrow';
const pView = ref(null)

const props = defineProps({
  singleMode: { default: true, type: Boolean },
  fillWH: { default: false, type: Boolean },
})

const { db, loading: db_loading, error: db_err } = useDuckDb()
import "https://cdn.jsdelivr.net/npm/@finos/perspective-viewer@3.1.3/dist/cdn/perspective-viewer.js";
import "https://cdn.jsdelivr.net/npm/@finos/perspective-viewer-datagrid@3.1.3/dist/cdn/perspective-viewer-datagrid.js";
import "https://cdn.jsdelivr.net/npm/@finos/perspective-viewer-d3fc@3.1.3/dist/cdn/perspective-viewer-d3fc.js";


import perspective from "https://cdn.jsdelivr.net/npm/@finos/perspective/dist/cdn/perspective.js";

let query = $ref("SELECT * FROM 'https://shell.duckdb.org/data/tpch/0_01/parquet/orders.parquet';");
let queryEditorRef = $ref(null);
let results: any = $ref(null);
let error: any = $ref('');
let pWorker = $ref(null);

// -- start methods --
const onClear = async () => {
  query = ''
}


const onPlay = async () => {
  const c = await db.value?.connect();
  console.log(perspective)
  console.debug("start loading duckdb_types;")
  console.debug("end loading duckdb")
  try {
    let r = await c.query(query)
    // console.log(typeof results, results)
    results = r;
    // results = JSON.parse(
    //   JSON.stringify(
    //     results.toArray(),
    //     (key, value) => (typeof value === 'bigint' ? value.toString() : value) // return everything else unchanged
    //   )
    // )
    console.log(results.schema)
    results = JSON.parse(
      JSON.stringify(
        results.toArray(),
        (key, value) => {
          console.log(key, value);
          return (typeof value === 'bigint' ? value.toString() : value)
        } // return everything else unchanged
      )
    )
    console.log(results)
    const table = pWorker.table(results,);

    pView?.value.load(table, {configure: false});
    // const resp = await fetch("https://cdn.jsdelivr.net/npm/superstore-arrow/superstore.lz4.arrow");
    // const arrow = await resp.arrayBuffer();
    // const table = pWorker.table(arrow);
    console.log('done')
    // pView._value.load(table);
  } catch (e) {
    error = e.message;
    console.log(e)
    console.log(`error`)
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
    <EditorCellToolbar :delete="!props.singleMode" @play="onPlay" @clear="onClear" />
    <textarea class="max-h-[40vh] p-2 text-xs border-2 focus:border-slate-700 rounded" v-model.lazy="query"
      ref="queryEditorRef" :disabled="db_loading" />

    <div>
      <perspective-viewer ref="pView" :class="[
        'resize-y overflow-auto',
        props.singleMode ? '' : 'h-[20vh]'
      ]"></perspective-viewer>
    </div>
  </div>
</template>

<style scoped></style>