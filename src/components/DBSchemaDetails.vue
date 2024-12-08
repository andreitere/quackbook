<script setup lang="ts">
import { useDBSchema } from "@/store/dbSchema.ts";
import { Button } from "@/components/ui/button";
import { db_events } from "@/store/meta.ts";
import { useLoading } from "@/hooks/useAsyncFn";
import "@he-tree/vue/style/default.css";
import { Input } from "@/components/ui/input";
import { computed, onMounted, ref } from "vue";

const { updateSchemaDetails, schema } = useDBSchema();
const events = ref<string[]>([]);
const filter = ref<string>("");
const filteredSchema = computed(() => {

  if (filter.value === "" || schema.value == null) {
    return schema.value;
  }
  return schema.value.filter((entry) => {
    return entry.key.toLowerCase().includes(filter.value.toLowerCase());
  });
});

const [updateSchema, { isLoading }] = useLoading(updateSchemaDetails);

db_events.on(async (msg) => {
  if (msg === "update_schemaasd") {
    await updateSchemaDetails();
  }
  events.value.push(msg as string);
});

onMounted(() => {
  updateSchemaDetails();
});
</script>

<template>
  <div class="space-y-2 resizable relative">
    <header class="p-3 flex items-center border-b-2">
      <h3 class="">Schema</h3>
      <div class="flex-grow"></div>
      <Button @click="updateSchema" variant="ghost" size="xs">
        <div class="i-lucide:refresh-ccw animated" :class="{ 'animate-spin': isLoading }"></div>
      </Button>
    </header>
    <div v-if="schema == null" class="text-center p-2">no tables yet ✨</div>
    <div>
      <div class="grid px-2 gap-2">
        <Input placeholder="search..." v-model:model-value="filter" />
        <div v-for="entry in filteredSchema" :key="entry.key">
          <div class="border border-gray-200 rounded-lg p-2 bg-white dark:bg-gray-800">
            <h2 class="text-md font-semibold tracking-wide text-gray-900 dark:text-gray-100">
              {{ entry.database }}.{{ entry.schema }}.{{ entry.table }}
            </h2>
            <div class="mt-4 space-y-2">
              <div v-for="(column, index) in entry.columns" :key="index"
                class="border border-gray-100 dark:border-gray-700 rounded-md p-3 bg-gray-50 dark:bg-gray-900">
                <p class="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {{ column.column_name }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Data Type: <span class="font-medium">{{ column.data_type }}</span>
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Nullable:
                  <span class="font-medium" :class="column.is_nullable === 'YES' ? 'text-green-500' : 'text-red-500'">
                    {{ column.is_nullable }}
                  </span>
                </p>
                <p v-if="column.column_default" class="text-sm text-gray-500 dark:text-gray-400">
                  Default: <span class="font-medium">{{ column.column_default }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- <BaseTree v-model="_schemaTree" ref="tree" :default-open="true">
      <template #default="{ node, stat }">
        <div class="flex gap-1">
          <button @click="stat.open = !stat.open">
            <div v-if="node.type === 'database'" :class="[
              'w-4 h-4 transition-all duration-200',
              stat.open ? 'i-iconoir:database-search' : 'i-iconoir:database-solid'
            ]"></div>
            <div v-if="node.type === 'schema'" :class="[
              'w-4 h-4',
              stat.open ? 'i-lucide:folder-open' : 'i-lucide:folder'
            ]"></div>
            <div v-if="node.type === 'table'" :class="[
              'w-4 h-4',
              stat.open ? 'i-lucide:table-properties' : 'i-lucide:table-2'
            ]"></div>
            <div v-if="node.type === 'column'" :class="['w-3 h-3 i-lucide:columns-2']"></div>
          </button>
          <span>{{ node.label }}</span>
        </div>
      </template>
</BaseTree> -->
  </div>
</template>

<style lang="scss">
.grtvn-self {
  @apply flex items-center space-x-2;
}

.grtvn-children-wrapper {
  @apply pl-4;

}

.column {
  .grtvn-children-wrapper {
    @apply py-0;
  }
}
</style>