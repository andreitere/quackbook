<script setup lang="ts">
import {
	type DropdownMenuSubEmits,
	type DropdownMenuSubProps,
	useForwardPropsEmits,
	DropdownMenuSub,
} from "radix-vue";
import { cn } from "@/lib/utils";
const props = defineProps<DropdownMenuSubProps>();
const emits = defineEmits<DropdownMenuSubEmits>();

const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <DropdownMenuSub v-bind="forwarded">
    <slot />
  </DropdownMenuSub>
</template>
