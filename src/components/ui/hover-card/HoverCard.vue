<script setup lang="ts">
import {
	type HoverCardRootEmits,
	type HoverCardRootProps,
	useForwardPropsEmits,
	HoverCardRoot,
} from "radix-vue";

const props = defineProps<HoverCardRootProps>();
const emits = defineEmits<HoverCardRootEmits>();

const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <HoverCardRoot v-bind="forwarded">
    <slot />
  </HoverCardRoot>
</template>
