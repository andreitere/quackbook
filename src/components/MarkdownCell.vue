<script setup lang="ts">

import { useMDRenderer } from "@/hooks/useMDShiki";
import { useProjects } from "@/store/project.ts";
import { defaultKeymap, history, historyKeymap, indentWithTab, } from "@codemirror/commands";
import { markdown as lang_markdown } from "@codemirror/lang-markdown";
import { defaultHighlightStyle, foldGutter, indentOnInput, syntaxHighlighting, } from "@codemirror/language";
import { EditorState } from "@codemirror/state";
import { drawSelection, EditorView, highlightActiveLine, highlightActiveLineGutter, highlightSpecialChars, keymap, lineNumbers, } from "@codemirror/view";
import { useColorMode, useVModels } from "@vueuse/core";
import { ayuLight, cobalt } from "thememirror";
import { computed, onMounted, ref, watch } from "vue";

import EditorCellToolbar from "@/components/EditorCellToolbar.vue";

const md_renderer = useMDRenderer()
const props = defineProps({
  mode: { default: "console", type: String },
  markdown: { type: String, default: "select 1+1 as result;" },
  id: { type: Number, required: true },
  position: { type: Number, required: true },
});
const { markdown } = useVModels(props);
const $projects = useProjects();

const color = useColorMode();
const rendered = ref<string>("");
const editMode = ref(false);

const markdownEditor = ref();
const editor = ref();

const doRender = async () => {
  await md_renderer.ready;
  rendered.value = md_renderer.md.render(markdown.value);
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
  <div
    :class="[
      'transition-all duration-200 w-full flex h-auto flex-col space-y-2 group p-3 relative rounded',
      'border-[1px] border-solid  hover:shadow-md  focus-within:border-slate-300 focus-within:shadow-md',
      editMode ? ' border-solid border-slate-200 hover:shadow-md' : 'border-transparent'
    ]"
  >
    <EditorCellToolbar
      :class="[
        'opacity-0 group-hover:opacity-100 top-3 right-3',
        editMode ? '' : 'absolute'
      ]"
      :delete="props.mode == 'notebook'"
      :trash="props.mode == 'notebook'"
      :duplicate="props.mode == 'notebook'"
      :play="false"
      :save="false"
      :clear="false"
      :edit="editMode != true"
      :update="editMode == true"
      :display_results="false"
      @movedown="$projects.moveDown(props.id)"
      @moveup="$projects.moveUp(props.id)"
      @trash="$projects.deleteCell(props.id)"
      @edit="editMode = true"
      @update="editMode = false"
    />
    <div
      v-show="editMode"
      ref="markdownEditor"
      class="p-2 overflow-y-scroll w-full nice-scrollbar max-h-[30vh]"
      style="field-sizing: content"
    />
    <div class=" text-sm w-full">
      <div
        class="prose prose-slate dark:prose-invert w-full"
        v-html="rendered"
      />
    </div>
  </div>
</template>

<style scoped></style>