<template>
  <div
    :class="[
      cn(
        'transition-all duration-200 w-full flex h-auto flex-col p-3 rounded space-y-2 group bg-white',
        'ring-[2px]  ring-transparent focus-within:shadow-md',
        error ? 'ring-red-100' : '',
        hasResults && !error ? 'ring-green-100' : '',
      ),
    ]"
    @focusin="inputFocused = true"
    @focusout="inputFocused = false"
  >
    <EditorCellToolbar
      :delete="props.mode == 'notebook'"
      :trash="props.mode == 'notebook'"
      :duplicate="props.mode == 'notebook'"
      :edit="false"
      :display_results="false"
      :format="true"
      @play="onPlay"
      @clear="onClear"
      @movedown="$projects.moveDown(props.id)"
      @moveup="$projects.moveUp(props.id)"
      @trash="$projects.deleteCell(props.id)"
      @format="onFormat"
    />
    <div class="flex items-start flex-col overflow-hidden">
      <div
        ref="queryEditorRef"
        class="p-2 overflow-y-scroll w-full nice-scrollbar max-h-[30vh]"
        style="field-sizing: content"
      />
    </div>

    <ResultsViewer
      v-if="hasResults"
      ref="resultsRef"
      class="w-full min-h-[500px] text-sm p-2"
    />
    <div class="info justify-end flex space-x-2">
      <span
        v-if="lastQueryDuration && !error"
        class="text-xs"
      >query took: {{ lastQueryDuration }} s</span>
      <pre
        v-if="error != ''"
        class="text-xs text-red-500 text-wrap"
        v-html="formattedError"
      />
      <div
        v-if="lastQueryDuration != '' && error == ''"
        class="i-ep:success-filled text-green-600 h-5 w-5"
      />
      <div
        v-if="error != ''"
        class="i-material-symbols:chat-error-outline text-red-600 h-5 w-5"
      />
      <div
        v-if="loading"
        class="i-svg-spinners-gooey-balls-1"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useTemplateRef, watch } from "vue";
import EditorCellToolbar from "@/components/EditorCellToolbar.vue";
import { format } from "sql-formatter";
import { useSQLBackend } from "@/hooks/useSQLBackend";
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

import { cn } from "@/lib/utils";
import ResultsViewer from "./ResultsViewer.vue";
import { QueryResult } from "@/types/database";

const resultsRef = useTemplateRef("resultsRef");
const color = useColorMode();
const props = defineProps({
	mode: { default: "notebook", type: String },
	query: { type: String, default: "select 1+1 as result;" },
	id: { type: Number, required: true },
	position: { type: Number, required: true },
});
const { query } = useVModels(props);

const { execute } = useSQLBackend();
const $projects = useProjects();
const queryEditor = useTemplateRef("queryEditorRef");
const hasResults = ref<boolean>(false);
const error = ref<string>("");
const inputFocused = ref(false);
const lastQueryDuration = ref("");
const loading = ref(false);
const editor = ref<EditorView>();

// -- start computed --

const formattedError = computed(() => {
	return error.value
		.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
		.replace(/\r\n|\n|\r/g, '<br />');
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


const handleStream = async (result: QueryResult) => {
	console.log(result);
	hasResults.value = true;
	await nextTick();
	const decoder = new TextDecoder("utf-8");
	let buffer = "";
	let isInit = false;
	const reader = result.records as ReadableStreamDefaultReader<Uint8Array>;
	while (true) {
		const { value, done } = await reader.read();
		if (done) break;

		buffer += decoder.decode(value, { stream: true });
		const lines = buffer.split('\n');
		buffer = lines.pop() || ""; // keep last incomplete line, ensure buffer is always a string

		for (const line of lines) {
			if (line.trim()) {
				const obj = JSON.parse(line);
				// console.log("obj", obj)
				// data.push(...obj)
				if (!isInit) {
					isInit = true;
					await resultsRef.value!.showTable(result.schema, obj)
				}
				resultsRef.value!.addData(obj)
			}
		}
	}
	console.log(result.schema)
}

const handleResult = async (result: QueryResult) => {
	const { records, schema } = result as { records: Record<string, unknown>[], schema: Record<string, string> };
	let processedRecords = records as Record<string, unknown>[];
	let processedSchema = schema;


	if (result.shouldStringify && Object.values(schema).includes("json")) {
		processedRecords = records.map((row) => {
			const _row = {};
			for (const [k, v] of Object.entries(row)) {
				//@ts-ignore
				_row[k] = JSON.stringify(v);
			}
			return _row;
		});
		processedSchema = Object.fromEntries(
			Object.entries(schema).map(([k, v]) => [k, v === "json" ? "string" : v])
		);
	}

	if (!processedRecords.length) {
		return
	}
	hasResults.value = true;
	await nextTick();
	await resultsRef.value!.showTable(processedSchema, processedRecords)
	resultsRef.value!.addData(processedRecords)

}



const onPlay = async () => {
	if (!inputFocused.value) return;
	try {
		hasResults.value = false;
		await nextTick();
		error.value = "";
		loading.value = true;


		const result = await execute({ query: query.value });
		console.log(`onPlay result`, result)
		if (result.records instanceof ReadableStreamDefaultReader) {
			handleStream(result)
		} else {
			handleResult(result)
		}

		if (/create|attach|copy/gi.test(query.value)) {
			db_events.emit("UPDATE_SCHEMA");
		}
	} catch (e) {
		console.log("error", e)
		if (e instanceof Error) {
			error.value = e.toString();
		} else {
			error.value = "An unknown error occured";
		}
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

});
</script>


<style lang="scss"></style>