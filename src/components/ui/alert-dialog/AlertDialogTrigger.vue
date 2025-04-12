<script setup lang="ts">
import {
	type AlertDialogTriggerProps,
	AlertDialogTrigger,
} from "radix-vue";

const props = defineProps<AlertDialogTriggerProps>();
</script>

<template>
  <AlertDialogTrigger v-bind="props">
    <slot />
  </AlertDialogTrigger>
</template>
