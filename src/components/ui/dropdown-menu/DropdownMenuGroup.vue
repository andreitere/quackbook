<script setup lang="ts">
import { type DropdownMenuGroupProps, DropdownMenuGroup } from "radix-vue";

const props = defineProps<DropdownMenuGroupProps>();
</script>

<template>
  <DropdownMenuGroup v-bind="props">
    <slot />
  </DropdownMenuGroup>
</template>
