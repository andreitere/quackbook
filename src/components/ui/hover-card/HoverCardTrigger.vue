<script setup lang="ts">
import { type HoverCardTriggerProps, HoverCardTrigger } from "radix-vue";

const props = defineProps<HoverCardTriggerProps>();
</script>

<template>
  <HoverCardTrigger v-bind="props">
    <slot />
  </HoverCardTrigger>
</template>
