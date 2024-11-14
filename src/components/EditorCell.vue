<script setup lang="ts">
import EditorCellToolbar from "@/components/EditorCellToolbar.vue";
import { useDuckDb } from "@/hooks/useDuckDb.ts";
import { computed, onMounted, ref, useTemplateRef, watch } from "vue";
import "https://cdn.jsdelivr.net/npm/@finos/perspective-viewer@3.1.3/dist/cdn/perspective-viewer.js";
import "https://cdn.jsdelivr.net/npm/@finos/perspective-viewer-datagrid@3.1.3/dist/cdn/perspective-viewer-datagrid.js";
import "https://cdn.jsdelivr.net/npm/@finos/perspective-viewer-d3fc@3.1.3/dist/cdn/perspective-viewer-d3fc.js";
import "@finos/perspective-viewer/dist/css/pro.css";
import "@finos/perspective-viewer/dist/css/pro-dark.css"; //@ts-ignore
import perspective from "https://cdn.jsdelivr.net/npm/@finos/perspective/dist/cdn/perspective.js";

import { arrowTypeToJsType } from "@/lib/utils.ts";
import { db_events } from "@/store/meta.ts";
import { useProjects } from "@/store/project.ts";
import {
	autocompletion,
	closeBrackets,
	closeBracketsKeymap,
	completionKeymap,
} from "@codemirror/autocomplete";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { markdown } from "@codemirror/lang-markdown";
import { sql } from "@codemirror/lang-sql";
import {
	defaultHighlightStyle,
	foldGutter,
	indentOnInput,
	syntaxHighlighting,
} from "@codemirror/language";
import { EditorState } from "@codemirror/state";
import {
	EditorView,
	crosshairCursor,
	drawSelection,
	highlightActiveLine,
	highlightActiveLineGutter,
	highlightSpecialChars,
	keymap,
	lineNumbers,
} from "@codemirror/view";
import { useColorMode, useVModels } from "@vueuse/core";
import type { Field, Table } from "apache-arrow";
import { ayuLight, cobalt } from "thememirror";

const pView = ref(null);
const color = useColorMode();
const props = defineProps({
	mode: { default: "console", type: String },
	query: { type: String, default: "select 1+1 as result;" },
	id: { type: Number, required: true },
	position: { type: Number, required: true },
});
const { query } = useVModels(props);

const { db, ready } = useDuckDb();
const $projects = useProjects();
const queryEditor = useTemplateRef("queryEditorRef");
const results = ref<Table>();
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
	results.value = undefined;
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
				lineNumbers(),
				highlightActiveLineGutter(),
				highlightSpecialChars(),
				foldGutter(),
				history(),
				drawSelection(),
				EditorState.allowMultipleSelections.of(true),
				indentOnInput(),
				syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
				crosshairCursor(),
				highlightActiveLine(),
				autocompletion(),
				closeBrackets(),
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
				]),
				sql(),
				markdown(),
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
	if (!db.value) return;
	if (!pWorker) return;
	await ready;
	error.value = "";
	lastQueryDuration.value = "";

	const c = await db.value.connect();
	try {
		loading.value = true;
		const start = performance.now();
		results.value = await c.query(query.value);
		if (!results.value) {
			return console.warn("no results");
		}
		//@ts-ignore{3}
		const mappedFields = results.value.schema.fields.reduce(
			(acc: Record<string, string>, next: Field) => {
				acc[next?.name as string] = arrowTypeToJsType(next.type);
				return acc;
			},
			{},
		);
		results.value = JSON.parse(
			JSON.stringify(
				results.value.toArray(),
				(_, value) => (typeof value === "bigint" ? value.toString() : value), // return everything else unchanged
			),
		);
		// let mappedR = []
		// //@ts-ignore
		// results.value.toArray().forEach(r => {
		//   Object.keys(r).forEach(key => {
		//     console.log(key, typeof key)
		//   })
		//   mappedR.push(JSON.parse(r.toString()))
		// })
		// results.value = mappedR;
		//@ts-ignore
		const table = await pWorker.value.table(mappedFields);
		table.update(results.value);
		//@ts-ignore
		pView.value.load(table, { configure: true });
		const end = performance.now();

		lastQueryDuration.value = ((end - start) / 1000).toFixed(5);
		db_events.emit("UPDATE_SCHEMA");
	} catch (e) {
		if (e instanceof Error) {
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
      <div ref="queryEditorRef" class=" p-2 overflow-y-scroll w-full nice-scrollbar max-h-[30vh]"  style="field-sizing: content"></div>
    </div>

    <div class="bg-blue-200 flex-grow" v-show="!!results" style="field-sizing: content">
      <perspective-viewer ref="pView" :class="[
        'overflow-hidden',
        props.mode=='console' ? 'h-full' : 'h-[15vh] min-h-[50px] resize-y'
      ]"
                          :theme="tableTheme"></perspective-viewer>
    </div>
    <div class="info justify-end flex space-x-2">
      <span class="text-xs" v-if="!!results && lastQueryDuration != ''">query took: {{ lastQueryDuration }} s</span>
      <span class="text-xs text-red-500 text-wrap" v-if="error != ''">{{ error }}</span>
      <div class="i-ep:success-filled text-green-600 h-5 w-5" v-if="lastQueryDuration != '' && error == ''"></div>
      <div class="i-material-symbols:chat-error-outline text-red-600 h-5 w-5" v-if="error != ''"></div>
      <div class="i-line-md:loading-twotone-loop h-5 w-5" v-if="loading"></div>
    </div>
  </div>
</template>

<style scoped></style>