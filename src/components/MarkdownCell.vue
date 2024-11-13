<script setup lang="ts">
import { useVModels } from "@vueuse/core";
import { onMounted, ref, watch } from "vue";
import { useMarkdownRenderer } from "@/hooks/useMDShiki";
import EditorCellToolbar from "@/components/EditorCellToolbar.vue";
import { Textarea } from "@/components/ui/textarea";
import { useProjects } from "@/store/project.ts";

const props = defineProps({
	mode: { default: "console", type: String },
	markdown: { type: String, default: "select 1+1 as result;" },
	id: { type: Number, required: true },
	position: { type: Number, required: true },
});
const { markdown } = useVModels(props);
const $projects = useProjects();
const { md, ready: md_ready } = useMarkdownRenderer();

const rendered = ref<string>("");
const editMode = ref(false);

const doRender = async () => {
	await md_ready;
	rendered.value = md.render(markdown.value);
};

watch(markdown, () => {
	doRender();
});

onMounted(() => {
	doRender();
});
</script>

<template>
  <div :class="[
    'transition-all duration-200 w-full flex h-auto flex-col rounded space-y-2 group',
    'focus-within:shadow-lg border-[2px] border-transparent',
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
    <Textarea v-model:model-value="markdown" style="field-sizing: content" v-if="editMode"/>
    <div class=" text-sm w-full">
      <div class="prose prose-slate dark:prose-invert w-full" v-html="rendered"></div>
    </div>


  </div>

</template>

<style scoped>

</style>