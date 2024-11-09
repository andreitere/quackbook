<script setup lang="ts">
import {useVModels} from "@vueuse/core";
import {Textarea} from "@/components/ui/textarea";
import {onMounted, watch} from "vue";
import {useMarkdownRenderer} from "@/hooks/useMDShiki.ts";

const props = defineProps({
  mode: {default: 'console', type: String},
  markdown: {type: String, default: 'select 1+1 as result;'},
  id: {type: Number, required: true},
  position: {type: Number, required: true},
})
const {markdown} = useVModels(props)

const {md, ready: md_ready} = useMarkdownRenderer()


let rendered = $ref('');

const doRender = async () => {
  await md_ready;
  console.log(`ready to render`)
  rendered = md.render(markdown.value)
  console.log(rendered.toString())
}

watch(markdown, () => {
  doRender()
})

onMounted(() => {
  doRender()
})
</script>

<template>
  <div :class="[
    'transition-all duration-200 w-full flex h-auto flex-col p-3 rounded space-y-2',
    'border-[2px] border-solid border-slate-200 hover:shadow-md focus-within:border-slate-400 focus-within:shadow-lg',
  ]"
  >
    <Textarea v-model:model-value="markdown"/>
    <div class=" text-sm">
      <div class="markdown-body" v-html="rendered"></div>
    </div>


  </div>

</template>

<style scoped>

</style>