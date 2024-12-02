<script setup lang="ts">
//@ts-ignore
import perspective from "https://cdn.jsdelivr.net/npm/@finos/perspective/dist/cdn/perspective.js";
import EditorCellToolbar from "@/components/EditorCellToolbar.vue";
import { RecordBatchReader } from "apache-arrow";
import { computed, nextTick, onMounted, ref, useTemplateRef, watch } from "vue";

import { format } from "sql-formatter";

import { useSQLBackend } from "@/hooks/useSQLBackend.ts";
import { useSQLExtensions } from "@/hooks/useSQLEditor.ts";
import { db_events } from "@/store/meta.ts";
import { useProjects } from "@/store/project.ts";
import {
	closeBracketsKeymap,
	completionKeymap,
} from "@codemirror/autocomplete";
import {
	defaultKeymap,
	historyKeymap,
	indentWithTab,
} from "@codemirror/commands";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { useColorMode, useVModels } from "@vueuse/core";
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

const { backend } = useSQLBackend();
const $projects = useProjects();
const { activeProject } = $projects;
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
					indentWithTab,
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
		if (activeProject.sql.backend === "duckdb_server") {
			const reader = await backend.value.query(query.value, true);
			hasResults.value = true;
			let table = null;

			const chunks = [];
			while (true) {
				const { value, done } = await reader.read();
				// console.log(value, done);

				if (done) break; // Exit loop if the stream ends
				if (value) {
					chunks.push(new Uint8Array(value));
				}
			}

			const arrowChunk = new Uint8Array(
				chunks.reduce((acc, chunk) => acc + chunk.length, 0),
			);
			let offset = 0;
			for (const chunk of chunks) {
				arrowChunk.set(chunk, offset);
				offset += chunk.length;
			}

			const recordBatchReader = RecordBatchReader.from(arrowChunk);
			const firstVal = recordBatchReader.next().value;
			//@ts-ignore
			table = await pWorker.value.table(firstVal.toArray());

			for (const batch of recordBatchReader) {
				table.update(batch.toArray());
			}
			//@ts-ignore
			pView.value.load(table);
		} else {
			let { records, schema } = await backend.value.query(query.value);
			if (Object.values(schema).includes("json")) {
				//@ts-ignore
				records = records.map((row) => {
					const _row = {};
					for (const [k, v] of Object.entries(row)) {
						//@ts-ignore
						_row[k] = JSON.stringify(v);
					}
					return _row;
				});
				schema = Object.fromEntries(
					Object.entries(schema).map(([k, v]) => [k, v === "json" ? "string" : v])
				);
			}
			//@ts-ignore
			const end = performance.now();
			lastQueryDuration.value = ((end - start) / 1000).toFixed(5);
			if (records.length) {
				hasResults.value = true;
				await nextTick();
				//@ts-ignore
				const table = await pWorker.value.table(records);
				// @ts-ignore
				pView.value.load(table, { configure: true });
			}
		}

		if (/create|attach|copy/gi.test(query.value)) {
			db_events.emit("UPDATE_SCHEMA");
		}
	} catch (e) {
		if (e instanceof Error) {
			error.value = e.toString();
		} else {
			error.value = "An unknown error occured";
		}
		// playQuack();
	} finally {
		loading.value = false;
	}
};

const onFormat = () => {
	const newVal = format(query.value, {
		language: "sql",
		tabWidth: 2,
		linesBetweenQueries: 1,
	});
	editor.value?.dispatch({
		changes: {
			from: 0,
			to: editor.value?.state.doc.toString().length,
			insert: newVal,
		},
	});
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
		'transition-all duration-200 w-full flex h-auto flex-col p-3 rounded space-y-2 group',
		props.mode == 'console' ? 'h-full' : 'border-[1px] border-solid border-slate-200 hover:shadow-md focus-within:border-slate-300 focus-within:shadow-lg',
	]" @focusin="inputFocused = true" @focusout="inputFocused = false">
		<EditorCellToolbar class=" duration-200" :class="[
			props.mode == 'console' ? 'opacity-80' : 'opacity-0 group-hover:opacity-100',
		]" :delete="props.mode == 'notebook'" :trash="props.mode == 'notebook'" :duplicate="props.mode == 'notebook'"
			@play="onPlay" @clear="onClear" @movedown="$projects.moveDown(props.id)"
			@moveup="$projects.moveUp(props.id)" @trash="$projects.deleteCell(props.id)" @format="onFormat"
			:edit="false" :display_results="false" :format="true" />
		<div class="flex items-start flex-col overflow-hidden">
			<div ref="queryEditorRef" class=" p-2 overflow-y-scroll w-full nice-scrollbar max-h-[30vh]"
				style="field-sizing: content"></div>
		</div>

		<div class="bg-blue-200 flex-grow" style="field-sizing: content" v-if="hasResults">
			<perspective-viewer ref="pView" :class="[
				'overflow-hidden',
				props.mode == 'console' ? 'h-full' : 'h-[20vh] flex-shrink min-h-[100px] resize-y'
			]" :theme="tableTheme"></perspective-viewer>
		</div>
		<div class="info justify-end flex space-x-2">
			<span class="text-xs" v-if="lastQueryDuration && !error">query took: {{ lastQueryDuration }} s</span>
			<span class="text-xs text-red-500 text-wrap" v-if="error != ''">{{ error }}</span>
			<div class="i-ep:success-filled text-green-600 h-5 w-5" v-if="lastQueryDuration != '' && error == ''"></div>
			<div class="i-material-symbols:chat-error-outline text-red-600 h-5 w-5" v-if="error != ''"></div>
			<div class="i-svg-spinners-gooey-balls-1" v-if="loading"></div>
		</div>
	</div>
</template>

<style lang="scss">
perspective-viewer {
	td {
		max-width: 20vw;
	}
}
</style>