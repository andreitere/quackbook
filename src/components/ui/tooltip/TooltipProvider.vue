<script setup lang="ts">
import { type TooltipProviderProps, TooltipProvider } from 'radix-vue'

const props = defineProps<TooltipProviderProps>()
</script>

<template>
  <TooltipProvider v-bind="props">
    <slot />
  </TooltipProvider>
</template>
