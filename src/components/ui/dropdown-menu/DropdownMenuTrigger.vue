<script setup lang="ts">
import {
	type DropdownMenuTriggerProps,
	useForwardProps,
	DropdownMenuTrigger,
} from "radix-vue";
const props = defineProps<DropdownMenuTriggerProps>();

const forwardedProps = useForwardProps(props);
</script>

<template>
  <DropdownMenuTrigger
    class="outline-none"
    v-bind="forwardedProps"
  >
    <slot />
  </DropdownMenuTrigger>
</template>
