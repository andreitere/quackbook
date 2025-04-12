<script setup lang="ts">
import type { QueryResult } from '@/types/database';
import EditorCellToolbar from '@/components/EditorCellToolbar.vue';
import { useSQLBackend } from '@/hooks/useSQLBackend';
import { useSQLExtensions } from '@/hooks/useSQLEditor.ts';
import { cn } from '@/lib/utils';
import { db_events } from '@/store/meta.ts';
import { useProjects } from '@/store/project.ts';
import { useQueryHistory } from '@/store/queryHistory';
import {
    closeBracketsKeymap,
    completionKeymap,
} from '@codemirror/autocomplete';
import {
    defaultKeymap,
    historyKeymap,
    indentWithTab,
} from '@codemirror/commands';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { useColorMode, useVModels } from '@vueuse/core';
import { format } from 'sql-formatter';

import { ayuLight, cobalt } from 'thememirror';
import { computed, nextTick, onMounted, reactive, ref, useTemplateRef, watch } from 'vue';
import ResultsViewer from './ResultsViewer.vue';

const props = defineProps({
    mode: { default: 'notebook', type: String },
    query: { type: String, default: 'select 1+1 as result;' },
    id: { type: Number, required: true },
    position: { type: Number, required: true },
});
const resultsRef = useTemplateRef('resultsRef');
const color = useColorMode();
const { query } = useVModels(props);

const { execute } = useSQLBackend();
const $projects = useProjects();
const queryEditor = useTemplateRef('queryEditorRef');
const hasResults = ref<boolean>(false);
const error = ref<string>('');
const inputFocused = ref(false);
const markers = reactive({
    loading: false,
    done: false,
    error: false,
});
const editor = ref<EditorView>();

const { addEntry } = useQueryHistory();

// -- start computed --

const formattedError = computed(() => {
    return error.value
        .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
        .replace(/\r\n|\n|\r/g, '<br />');
});

const editorTheme = computed(() => {
    if (color.value === 'light') {
        return ayuLight;
    }
    return cobalt;
});

// -- end computed --

// -- start methods --
async function onClear() {
    hasResults.value = false;
    error.value = '';
    markers.done = false;
    markers.error = false;
    markers.loading = false;
}

function initEditor() {
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
                        key: 'Meta-Enter', // 'Mod' is Cmd on Mac, Ctrl on Windows/Linux
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
}

async function handleStream(result: QueryResult) {
    console.error(result);
    hasResults.value = result.isRetrievalQuery ?? false;
    await nextTick();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    let isInit = false;
    const reader = result.records as ReadableStreamDefaultReader<Uint8Array>;
    while (true) {
        const { value, done } = await reader.read();
        if (done)
            break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // keep last incomplete line, ensure buffer is always a string

        for (const line of lines) {
            if (line.trim()) {
                const obj = JSON.parse(line);
                if (!isInit) {
                    isInit = true;
                    await resultsRef.value!.showTable(result.schema, obj);
                }
                resultsRef.value!.addData(obj);
            }
        }
    }
    markers.done = true;
}

async function handleResult(result: QueryResult) {
    const { records, schema, isRetrievalQuery } = result as { records: Record<string, unknown>[]; schema: Record<string, string>; isRetrievalQuery: boolean };
    let processedRecords = records as Record<string, unknown>[];
    let processedSchema = schema;

    if (result.shouldStringify && Object.values(schema).includes('json')) {
        processedRecords = records.map((row) => {
            const _row = {};
            for (const [k, v] of Object.entries(row)) {
                // @ts-expect-error - TypeScript doesn't recognize dynamic object property assignment
                _row[k] = JSON.stringify(v);
            }
            return _row;
        });
        processedSchema = Object.fromEntries(
            Object.entries(schema).map(([k, v]) => [k, v === 'json' ? 'string' : v]),
        );
    }

    markers.done = true;
    if (!processedRecords.length) {
        return;
    }
    hasResults.value = isRetrievalQuery;
    await nextTick();
    console.log('show table');
    await resultsRef.value!.showTable(processedSchema, processedRecords);
    console.log('setup table');
    resultsRef.value!.addData(processedRecords);
    console.log('added data');
}

async function onPlay() {
    if (!inputFocused.value)
        return;
    try {
        hasResults.value = false;
        await nextTick();
        error.value = '';
        markers.loading = true;
        markers.done = false;
        markers.error = false;

        const startTime = performance.now();
        const result = await execute({ query: query.value });
        const duration = (performance.now() - startTime) / 1000; // Convert to seconds

        console.log(`onPlay result`, result);
        if (result.records instanceof ReadableStreamDefaultReader) {
            handleStream(result);
        }
        else {
            handleResult(result);
        }
        addEntry({
            query: query.value,
            duration,
        });

        if (/create|attach|copy/i.test(query.value)) {
            db_events.emit('UPDATE_SCHEMA');
        }
    }
    catch (e) {
        console.log('error', e);
        const errorMessage = e instanceof Error ? e.toString() : 'An unknown error occurred';
        error.value = errorMessage;
        markers.error = true;
    }
    finally {
        markers.loading = false;
    }
}

function onFormat() {
    const newVal = format(query.value, {
        language: 'sql',
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
}

// -- end methods --
watch(queryEditor, () => {
    initEditor();
});

watch(color, initEditor);

onMounted(async () => {

});
</script>

<template>
    <div
        :class="[
            cn(
                'transition-all duration-200 w-full flex h-auto flex-col p-3 rounded space-y-2 group bg-white',
                'ring-[2px]  ring-transparent focus-within:shadow-md',
                markers.error ? 'ring-red-300' : '',
                markers.done && !markers.error ? 'ring-lime-300' : '',
            ),
        ]"
        @focusin="inputFocused = true"
        @focusout="inputFocused = false"
    >
        <div class="flex items-center gap-2">
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
                @insert-above="$projects.insertCell('sql', props.position, null)"
                @insert-below="$projects.insertCell('sql', props.position + 1, null)"
            />
        </div>
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
            class="w-full min-h-[250px] text-sm p-2 fit-content"
        />

        <div class="info justify-end flex space-x-2">
            <pre
                v-if="markers.error"
                class="text-xs text-red-500 text-wrap"
                v-html="formattedError"
            />
            <div
                v-if="markers.done"
                class="i-ep:success-filled text-green-600 h-5 w-5"
            />
            <div
                v-if="markers.error"
                class="i-material-symbols:chat-error-outline text-red-600 h-5 w-5"
            />
            <div
                v-if="markers.loading"
                class="i-svg-spinners-gooey-balls-1"
            />
        </div>
    </div>
</template>

<style lang="scss"></style>
