<script setup lang="ts">

import { useProjects } from "@/store/project.ts";
import { ref } from "vue";

const $projects = useProjects();
const isEditing = ref(false);
const inputRef = ref<HTMLInputElement | null>(null);

const startEditing = () => {
  isEditing.value = true;
  // Focus the input after a small delay to ensure it's mounted
  setTimeout(() => {
    inputRef.value?.focus();
  }, 0);
};

const stopEditing = () => {
  isEditing.value = false;
};
</script>

<template>
  <div class="relative">
    <div
      v-if="!isEditing"
      @click="startEditing"
      class="md:min-w-[300px] flex-grow md:flex-grow-0 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-center focus:bg-white dark:focus:bg-slate-600 shadow-sm rounded-md h-9 px-3 py-1 flex items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
    >
      {{ $projects.activeProjectMeta.name }}
    </div>
    <Input
      v-else
      ref="inputRef"
      v-model:model-value="$projects.activeProjectMeta.name"
      @blur="stopEditing"
      @keydown.enter="stopEditing"
      @keydown.esc="stopEditing"
      class="md:min-w-[300px] flex-grow md:flex-grow-0 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-center focus:bg-white dark:focus:bg-slate-600 shadow-sm"
    />
  </div>
</template> 