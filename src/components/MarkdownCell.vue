<script setup lang="ts">
import EditorCellToolbar from "@/components/EditorCellToolbar.vue";
import { useMarkdownRenderer } from "@/hooks/useMDShiki";
import { useProjects } from "@/store/project.ts";
import {
	defaultKeymap,
	history,
	historyKeymap,
	indentWithTab,
} from "@codemirror/commands";
import { markdown as lang_markdown } from "@codemirror/lang-markdown";
import {
	defaultHighlightStyle,
	foldGutter,
	indentOnInput,
	syntaxHighlighting,
} from "@codemirror/language";
import { EditorState } from "@codemirror/state";
import {
	EditorView,
	drawSelection,
	highlightActiveLine,
	highlightActiveLineGutter,
	highlightSpecialChars,
	keymap,
	lineNumbers,
} from "@codemirror/view";
import { useColorMode, useVModels } from "@vueuse/core";
import { ayuLight, cobalt } from "thememirror";
import { computed, onMounted, ref, watch } from "vue";

const props = defineProps({
	mode: { default: "console", type: String },
	markdown: { type: String, default: "select 1+1 as result;" },
	id: { type: Number, required: true },
	position: { type: Number, required: true },
});
const { markdown } = useVModels(props);
const $projects = useProjects();
const { md, ready: md_ready } = useMarkdownRenderer();
const color = useColorMode();
const rendered = ref<string>("");
const editMode = ref(false);

const markdownEditor = ref();
const editor = ref();

const doRender = async () => {
	await md_ready;
	rendered.value = md.render(markdown.value);
};
const editorTheme = computed(() => {
	if (color.value === "light") {
		return ayuLight;
	}
	return cobalt;
});

const initEditor = () => {
	if (editor.value) {
		editor.value.destroy();
	}
	console.log(editor);
	editor.value = new EditorView({
		state: EditorState.create({
			doc: props.markdown,
			extensions: [
				editorTheme.value,
				lineNumbers(),
				lang_markdown(),
				highlightActiveLineGutter(),
				highlightSpecialChars(),
				foldGutter(),
				history(),
				drawSelection(),
				EditorState.allowMultipleSelections.of(true),
				indentOnInput(),
				syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
				highlightActiveLine(),
				keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
				EditorView.updateListener.of((update) => {
					if (update.docChanged) {
						markdown.value = editor.value?.state.doc.toString() as string;
					}
				}),
			],
		}),
		parent: markdownEditor.value as Element,
	});
};

watch(editMode, (v) => {
	if (!v) return;
});

watch(markdown, () => {
	doRender();
});
watch(color, initEditor);
onMounted(() => {
	initEditor();
	doRender();
});
</script>

<template>
  <div :class="[
    'transition-all duration-200 w-full flex h-auto flex-col rounded space-y-2 group p-3',
    'focus-within:shadow-lg border-l-[2px] border-transparent hover:border-gray-500',
    editMode ? ' border-solid border-slate-200 hover:shadow-md' : ''
  ]"
  >
    <EditorCellToolbar
        class="opacity-0 group-hover:opacity-100"
        :delete="props.mode == 'notebook'"
        :trash="props.mode == 'notebook'"
        :duplicate="props.mode == 'notebook'"
        :play="false"
        :save="false"
        :clear="false"
        :edit="editMode != true"
        @movedown="$projects.moveDown(props.id)"
        @moveup="$projects.moveUp(props.id)"
        @trash="$projects.deleteCell(props.id)"
        @edit="editMode = true"
        @update="editMode = false"
        :update="editMode == true"
        :display_results="false"

    />
    <div class="p-2 overflow-y-scroll w-full nice-scrollbar max-h-[30vh]"  style="field-sizing: content" v-show="editMode" ref="markdownEditor"></div>
    <div class=" text-sm w-full">
      <div class="prose prose-slate dark:prose-invert w-full" v-html="rendered"></div>
    </div>


  </div>

</template>

<style scoped>

</style>