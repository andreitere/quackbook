<script setup lang="ts">
import EditorCellToolbar from "@/components/EditorCellToolbar.vue";
import {computed, nextTick, onMounted, ref, useTemplateRef, watch} from "vue";
import "https://cdn.jsdelivr.net/npm/@finos/perspective-viewer@3.1.3/dist/cdn/perspective-viewer.js";
import "https://cdn.jsdelivr.net/npm/@finos/perspective-viewer-datagrid@3.1.3/dist/cdn/perspective-viewer-datagrid.js";
import "https://cdn.jsdelivr.net/npm/@finos/perspective-viewer-d3fc@3.1.3/dist/cdn/perspective-viewer-d3fc.js";
import "@finos/perspective-viewer/dist/css/pro.css";
import "@finos/perspective-viewer/dist/css/pro-dark.css"; //@ts-ignore
import perspective from "https://cdn.jsdelivr.net/npm/@finos/perspective/dist/cdn/perspective.js";

import {db_events} from "@/store/meta.ts";
import {useProjects} from "@/store/project.ts";
import {closeBracketsKeymap, completionKeymap,} from "@codemirror/autocomplete";
import {defaultKeymap, historyKeymap, indentWithTab} from "@codemirror/commands";
import {EditorState} from "@codemirror/state";
import {EditorView, keymap,} from "@codemirror/view";
import {useColorMode, useVModels} from "@vueuse/core";
import {ayuLight, cobalt} from "thememirror";
import {useSQLBackend} from "@/hooks/useSQLBackend.ts";
import {useSQLExtensions} from "@/hooks/useSQLEditor.ts";

const pView = ref(null);
const color = useColorMode();
const props = defineProps({
  mode: {default: "console", type: String},
  query: {type: String, default: "select 1+1 as result;"},
  id: {type: Number, required: true},
  position: {type: Number, required: true},
});
const {query} = useVModels(props);

const {backend} = useSQLBackend()
const $projects = useProjects();
const queryEditor = useTemplateRef("queryEditorRef");
const hasResults = ref<boolean>(false);
const error = ref<string>("");
const pWorker = ref(null);
const inputFocused = ref(false);
const lastQueryDuration = ref("");
const loading = ref(false);

const editor = ref<EditorView>();

// -- start computed --

const tableTheme = computed(() => {
  if (color.value === "light") {
    return "Pro Light";
  }
  return "Pro Dark";
});

const editorTheme = computed(() => {
  if (color.value === "light") {
    return ayuLight;
  }
  return cobalt;
});

// -- end computed --

// -- start methods --
const onClear = async () => {
  hasResults.value = false;
  error.value = "";
};

const initEditor = () => {
  if (editor.value) {
    editor.value.destroy();
  }
  editor.value = new EditorView({
    state: EditorState.create({
      doc: props.query,
      extensions: [
        editorTheme.value,
        ...useSQLExtensions(),
        keymap.of([
          {
            key: "Meta-Enter", // 'Mod' is Cmd on Mac, Ctrl on Windows/Linux
            run() {
              onPlay(); // Emit an event for Cmd+Enter
              return true;
            },
            preventDefault: true,
          },
          ...defaultKeymap,
          ...historyKeymap,
          ...completionKeymap,
          ...closeBracketsKeymap,
          indentWithTab
        ]),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            query.value = editor.value?.state.doc.toString() as string;
          }
        }),
      ],
    }),
    parent: queryEditor.value as Element,
  });
};

const onPlay = async () => {
  if (!inputFocused) return;
  try {
    hasResults.value = false;
    await nextTick();
    error.value = "";
    loading.value = true;
    const start = performance.now();
    const {records} = await backend.value.query(query.value);
    if (!records.length) {
      // return;
    }

    hasResults.value = true
    await nextTick();
    //@ts-ignore
    const table = await pWorker.value.table(records);
    // @ts-ignore
    pView.value.load(table, {configure: true});
    const end = performance.now();
    lastQueryDuration.value = ((end - start) / 1000).toFixed(5);
    if (/create|attach|copy/ig.test(query.value)) {
      db_events.emit("UPDATE_SCHEMA");
    }
  } catch (e) {
    if (e instanceof Error) {
      console.log(e)
      error.value = e.toString();
    } else {
      error.value = "An unknown error occured";
    }
  } finally {
    loading.value = false;
  }
};

// -- end methods --
watch(queryEditor, () => {
  initEditor();
});

watch(color, initEditor);

onMounted(async () => {
  pWorker.value = await perspective.worker();
});
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
                       @movedown="$projects.moveDown(props.id)"
                       @moveup="$projects.moveUp(props.id)"
                       @trash="$projects.deleteCell(props.id)"
                       :edit="false"
                       :display_results="false"/>
    <div class="flex items-start flex-col overflow-hidden">
      <div ref="queryEditorRef" class=" p-2 overflow-y-scroll w-full nice-scrollbar max-h-[30vh]" style="field-sizing: content"></div>
    </div>

    <div class="bg-blue-200 flex-shrink" style="field-sizing: content" v-if="hasResults">
      <perspective-viewer ref="pView" :class="[
        'overflow-hidden',
        props.mode=='console' ? 'h-full' : 'h-[15vh] min-h-[50px] resize-y'
      ]"
                          :theme="tableTheme"></perspective-viewer>
    </div>
    <div class="info justify-end flex space-x-2">
      <span class="text-xs" v-if="hasResults && lastQueryDuration != ''">query took: {{ lastQueryDuration }} s</span>
      <span class="text-xs text-red-500 text-wrap" v-if="error != ''">{{ error }}</span>
      <div class="i-ep:success-filled text-green-600 h-5 w-5" v-if="lastQueryDuration != '' && error == ''"></div>
      <div class="i-material-symbols:chat-error-outline text-red-600 h-5 w-5" v-if="error != ''"></div>
      <div class="i-line-md:loading-twotone-loop h-5 w-5" v-if="loading"></div>
    </div>
  </div>
</template>

<style scoped></style>