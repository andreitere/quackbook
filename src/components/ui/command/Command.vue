<script setup lang="ts">
import { type ComboboxRootEmits, ComboboxRootProps, ComboboxRoot } from "radix-vue";
import { useForwardPropsEmits } from "radix-vue";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
const props = withDefaults(
	defineProps<ComboboxRootProps & { class?: HTMLAttributes["class"] }>(),
	{
		open: true,
		modelValue: "",
	},
);

const emits = defineEmits<ComboboxRootEmits>();

const delegatedProps = computed(() => {
	const { class: _, ...delegated } = props;

	return delegated;
});

const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <ComboboxRoot
    v-bind="forwarded"
    :class="cn('flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground', props.class)"
  >
    <slot />
  </ComboboxRoot>
</template>
