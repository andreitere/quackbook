ark
<script setup lang="ts">
import { useDBSchema } from "@/store/dbSchema.ts";
import { Button } from "@/components/ui/button";
import { db_events } from "@/store/meta.ts";
import { useLoading } from "@/hooks/useAsyncFn";
import "@he-tree/vue/style/default.css";
import { Input } from "@/components/ui/input";
import { computed, onMounted, ref } from "vue";
import DBTable from './DBTable.vue'

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
      <header class="p-3 flex items-center border-b-2 bg-gray-300 text-foreground">
        <h3 class="tracking-tighter">Schema</h3>
        <div class="flex-grow"></div>
        <Button @click="updateSchema" variant="ghost" size="xs">
          <div class="i-lucide:refresh-ccw animated" :class="{ 'animate-spin': isLoading }"></div>
        </Button>
      </header>
      <Input placeholder="search..." v-model:model-value="filter" />
      <div class="flex flex-col overflow-y-scroll nice-scrollbar h-0 flex-grow space-y-2">
        <DBTable v-for="entry in filteredSchema" :key="entry.key" :dbtable="entry" />
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