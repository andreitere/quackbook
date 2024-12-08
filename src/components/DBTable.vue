<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { ref } from "vue";
defineProps<{
	dbtable: Record<string, any>;
}>()


const expanded = ref(false);
const toggleExpand = () => {
	expanded.value = !expanded.value;
};

</script>

<template>
	<div class="p-1 border border-gray-200 rounded-lg bg-white dark:bg-gray-800" :class="{ 'slim': !expanded }">
		<div class="flex justify-between p-2">
			<h2 class="text-md font-semibold flex flex-col tracking-tight text-gray-900 dark:text-gray-100">
				<span class="text-muted-foreground text-xs">{{ dbtable.database }}.{{ dbtable.schema }}</span>
				<span class="text-md">{{ dbtable.table }}</span>
			</h2>
			<div>
				<Button variant="ghost" @click="toggleExpand">
					<div class="animated"
						:class="{ 'i-tabler:minimize animated-bounce-in': expanded, 'i-tabler:maximize animated-rubber-band': !expanded }">
					</div>
				</Button>
			</div>
		</div>
		<div class="grid gap-2 columns">
			<div v-for="(column, index) in dbtable.columns" :key="index"
				class="border column border-gray-100 dark:border-gray-700 rounded-md p-2 bg-gray-50 dark:bg-gray-900">
				<p class="text-sm font-medium text-gray-800 dark:text-gray-200">
					{{ column.column_name }}
				</p>
				<div class="info text-xs">
					<p class=" text-gray-500 dark:text-gray-400">
						<span class="attr">Data Type: </span>
						<span class="font-medium">{{ column.data_type }}</span>
					</p>
					<p class="text-gray-500 dark:text-gray-400">
						<span class="attr">Nullable:</span>
						<span class="font-medium"
							:class="column.is_nullable === 'YES' ? 'text-green-500' : 'text-red-500'">
							{{ column.is_nullable }}
						</span>
					</p>
					<p class=" text-gray-500 dark:text-gray-400">
						<span class="attr">Default: </span><span class="font-medium default-value">{{
							column.column_default
						}}</span>
					</p>
				</div>
			</div>
		</div>
	</div>
</template>
<style lang="scss">
.slim {
	.default-value {
		display: none;
	}

	.columns {
		gap: 0px;
	}

	.column {
		border-radius: 0px;
		display: flex;
		justify-content: space-between;

		.info {
			display: flex;
			@apply space-x-1
		}
	}

	.attr {
		display: none;
	}
}
</style>