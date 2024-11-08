<script setup lang="ts">

import {Button} from "@/components/ui/button";
import {Checkbox} from '@/components/ui/checkbox'
import {Label} from '@/components/ui/label'
import {useMagicKeys} from "@vueuse/core";
import {watch} from "vue";

defineProps({
  play: {default: true},
  save: {default: true},
  clear: {default: true},
  duplicate: {default: true},
  trash: {default: true},
})
const display_results = defineModel("display_results");

const $emit = defineEmits(["save", "clear", "play", "duplicate", "trash", "display_results"]);


const keys = useMagicKeys();

const cmdEnter = keys['Cmd+Enter'];


watch(cmdEnter, (v) => {
  if(!v) return;
  console.log(`cmdEnter`);
  $emit("play")
})


</script>

<template>
  <div class="flex space-x-2">
    <Button size="xs" class="cursor-pointer" variant="outline" v-if="play" @click="$emit('play')">
      <div class="i-pixelarticons:play h-4 w-4"></div>
    </Button>
    <Button size="xs" variant="outline" v-if="save" @click="$emit('save')">
      <div class="i-pixelarticons:save h-4 w-4"></div>
    </Button>
    <Button size="xs" variant="outline" v-if="clear" @click="$emit('clear')">
      <div class="i-pixelarticons:delete h-4 w-4"></div>
    </Button>
    <Label class="flex items-center space-x-1 border-[1px] rounded p-1 cursor-pointer">
      <Checkbox :checked="display_results" @update:checked="(v) => $emit('update:display_results', v)"/>

      <span class="text-xs">show results</span>
    </Label>
    <Button class="space-x-1" size="xs" variant="outline" v-if="display_results"
            @click="$emit('update:display_results', $event.target.value)">
    </Button>
    <div class="flex-grow"></div>
    <Button size="xs" variant="outline">
      <div class="i-pixelarticons:arrow-up h-4 w-4"></div>
    </Button>
    <Button size="xs" variant="outline">
      <div class="i-pixelarticons:arrow-down h-4 w-4"></div>
    </Button>
    <Button size="xs" variant="outline" v-if="duplicate" @click="$emit('duplicate')">
      <div class="i-pixelarticons:duplicate h-4 w-4"></div>
    </Button>
    <Button size="xs" variant="outline" v-if="trash" @click="$emit('trash')">
      <div class="i-pixelarticons:trash h-4 w-4"></div>
    </Button>
  </div>
</template>

<style scoped></style>