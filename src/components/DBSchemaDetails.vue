ark<script setup lang="ts">
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
  <div class="space-y-2 resizable relative flex flex-col max-h-[100dvh] h-full">
    <div class="space-y-2 flex flex-col flex-grow">
      <header class="p-3 flex items-center border-b-2 bg-gray-300 text-foreground">
        <h3 class="tracking-tighter">Schema</h3>
        <div class="flex-grow"></div>
        <Button @click="updateSchema" variant="ghost" size="xs">
          <div class="i-lucide:refresh-ccw animated" :class="{ 'animate-spin': isLoading }"></div>
        </Button>
      </header>
      <Input placeholder="search..." v-model:model-value="filter" />
      <div class="flex flex-col overflow-y-scroll nice-scrollbar h-0 flex-grow space-y-2">
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
    <!-- <div class="space-y-2">
      <header class="p-3 flex items-center border-b-2 bg-gray-300 text-foreground">
        <h3 class="">Events</h3>
        <div class="flex-grow"></div>
        <Button @click="updateSchema" variant="ghost" size="xs">
          <div class="i-lucide:refresh-ccw animated" :class="{ 'animate-spin': isLoading }"></div>
        </Button>
      </header>
    </div> -->

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