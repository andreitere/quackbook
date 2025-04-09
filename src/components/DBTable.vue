<script setup lang="ts">

import { ref, watch } from "vue";
import type { Database, } from "@/store/dbSchema";

const props = defineProps<{
	database: Database;
	databaseName: string;
}>();

const expanded = ref(true);
const schemaExpandedStates = ref<Record<string, boolean>>({});
const tableExpandedStates = ref<Record<string, boolean>>({});

// Initialize expansion states
const initializeExpansionStates = () => {
	Object.keys(props.database.schemas).forEach(schemaName => {
		schemaExpandedStates.value[schemaName] = true;
		Object.keys(props.database.schemas[schemaName].tables).forEach(tableName => {
			tableExpandedStates.value[`${schemaName}.${tableName}`] = false;
		});
	});
};

// Watch for changes in the database prop to reinitialize states
watch(() => props.database, initializeExpansionStates, { immediate: true });
</script>

<template>
	<div class="tree-container">
		<Collapsible v-model:open="expanded" class="space-y-2">
			<div class="tree-item">
				<CollapsibleTrigger class="tree-header w-full">
					<div class="flex items-center gap-2">
						<div class="tree-icon">
							<div class="animated"
								:class="{ 'i-tabler:chevron-down': expanded, 'i-tabler:chevron-right': !expanded }">
							</div>
						</div>
						<div class="tree-content">
							<span class="database-name">{{ databaseName }}</span>
						</div>
					</div>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<div class="tree-children">
						<div v-for="(schema, schemaName) in database.schemas" :key="schemaName" class="tree-item">
							<Collapsible v-model:open="schemaExpandedStates[schemaName]" class="space-y-2">
								<CollapsibleTrigger class="tree-header w-full">
									<div class="flex items-center gap-2">
										<div class="tree-icon">
											<div class="i-tabler:folder"></div>
										</div>
										<div class="tree-content">
											<span class="schema-name">{{ schemaName }}</span>
										</div>
									</div>
								</CollapsibleTrigger>
								<CollapsibleContent>
									<div class="tree-children">
										<div v-for="(table, tableName) in schema.tables" :key="tableName"
											class="tree-item">
											<Collapsible
												v-model:open="tableExpandedStates[`${schemaName}.${tableName}`]"
												class="space-y-2">
												<CollapsibleTrigger class="tree-header w-full">
													<div class="flex items-center gap-2">
														<div class="tree-icon">
															<div class="i-tabler:table"></div>
														</div>
														<div class="tree-content">
															<span class="table-name">{{ tableName }}</span>
														</div>
													</div>
												</CollapsibleTrigger>
												<CollapsibleContent>
													<div class="tree-children">
														<div v-for="column in table.columns" :key="column.column_name"
															class="tree-item">
															<div class="tree-header">
																<div class="flex items-center gap-2">
																	<div class="tree-icon">
																		<div class="i-tabler:column-insert-right"></div>
																	</div>
																	<div class="tree-content">
																		<span class="column-name">{{ column.column_name
																			}}</span>
																		<span class="column-type">{{ column.data_type
																			}}</span>
																		<span class="column-nullable"
																			:class="column.is_nullable ? 'text-green-500' : 'text-red-500'">
																			{{ column.is_nullable ? 'YES' : 'NO' }}
																		</span>
																		<span v-if="column.column_default"
																			class="column-default">
																			{{ column.column_default }}
																		</span>
																	</div>
																</div>
															</div>
														</div>
													</div>
												</CollapsibleContent>
											</Collapsible>
										</div>
									</div>
								</CollapsibleContent>
							</Collapsible>
						</div>
					</div>
				</CollapsibleContent>
			</div>
		</Collapsible>
	</div>
</template>

<style lang="scss">
.tree-container {
	@apply text-sm;
}

.tree-item {
	@apply pl-4;
}

.tree-header {
	@apply flex items-center gap-2 py-1 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded;
}

.tree-icon {
	@apply flex items-center justify-center w-4 h-4 text-gray-500 dark:text-gray-400;
}

.tree-content {
	@apply flex items-center gap-2 text-gray-900 dark:text-gray-100;
}

.tree-children {
	@apply pl-4;
}

.database-name {
	@apply font-medium;
}

.schema-name {
	@apply text-gray-700 dark:text-gray-300;
}

.table-name {
	@apply text-gray-700 dark:text-gray-300;
}

.column-name {
	@apply text-gray-700 dark:text-gray-300;
}

.column-type {
	@apply text-xs text-gray-500 dark:text-gray-400;
}

.column-nullable {
	@apply text-xs;
}

.column-default {
	@apply text-xs text-gray-500 dark:text-gray-400;
}
</style>