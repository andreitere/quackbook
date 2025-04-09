ark
<script setup lang="ts">
import { useDBSchema } from "@/store/dbSchema.ts";
import { db_events } from "@/store/meta.ts";
import { useLoading } from "@/hooks/useAsyncFn";
import "@he-tree/vue/style/default.css";
import { computed, onMounted, ref } from "vue";

const { updateSchemaDetails, schema } = useDBSchema();
const events = ref<string[]>([]);
const filter = ref<string>("");

const filteredSchema = computed(() => {
  if (!schema.value || filter.value === "") {
    return schema.value;
  }

  const searchTerm = filter.value.toLowerCase();
  const filtered: Record<string, any> = {};

  Object.entries(schema.value).forEach(([dbName, db]) => {
    const filteredSchemas: Record<string, any> = {};

    Object.entries(db.schemas).forEach(([schemaName, schema]) => {
      const filteredTables: Record<string, any> = {};

      Object.entries(schema.tables).forEach(([tableName, table]) => {
        if (
          dbName.toLowerCase().includes(searchTerm) ||
          schemaName.toLowerCase().includes(searchTerm) ||
          tableName.toLowerCase().includes(searchTerm) ||
          table.columns.some(col => col.column_name.toLowerCase().includes(searchTerm))
        ) {
          filteredTables[tableName] = table;
        }
      });

      if (Object.keys(filteredTables).length > 0) {
        filteredSchemas[schemaName] = {
          ...schema,
          tables: filteredTables
        };
      }
    });

    if (Object.keys(filteredSchemas).length > 0) {
      filtered[dbName] = {
        ...db,
        schemas: filteredSchemas
      };
    }
  });

  return filtered;
});

const [updateSchema, { isLoading }] = useLoading(updateSchemaDetails);

db_events.on(async (msg) => {
  if (msg === "UPDATE_SCHEMA") {
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
      <header class="p-4 flex items-center border-b  text-gray-800">
        <div class="flex items-center space-x-3">
          <div class="i-lucide:database text-xl text-blue-600"></div>
          <h3 class="text-lg font-semibold">Schema</h3>
        </div>
        <div class="flex-grow"></div>
        <Button @click="updateSchema" variant="ghost" size="xs" class="hover:bg-gray-100">
          <div class="i-lucide:refresh-ccw animated" :class="{ 'animate-spin': isLoading }"></div>
        </Button>
      </header>
      <Input placeholder="search..." v-model:model-value="filter" />
      <div class="flex flex-col overflow-y-scroll nice-scrollbar h-0 flex-grow space-y-2">
        <template v-if="filteredSchema">
          <DBTable v-for="(db, dbName) in filteredSchema" :key="dbName" :database="db" :databaseName="dbName" />
        </template>
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