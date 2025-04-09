<script setup lang="ts">
import { type ToastProviderProps, ToastProvider } from "radix-vue";

const props = defineProps<ToastProviderProps>();
</script>

<template>
  <ToastProvider v-bind="props">
    <slot />
  </ToastProvider>
</template>
