<script setup lang="ts">
import { useQueryHistory } from "@/store/queryHistory";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const { history, clearHistory } = useQueryHistory();

const formatDate = (timestamp: number) => {
  return format(new Date(timestamp), "MMM d, yyyy HH:mm:ss");
};
</script>

<template>
  <div class="space-y-2 flex flex-col h-full">
    <header class="p-4 flex items-center border-b text-gray-800">
      <div class="flex items-center space-x-3">
        <div class="i-lucide:history text-xl text-blue-600" />
        <h3 class="text-lg font-semibold">
          Query History
        </h3>
      </div>
      <div class="flex-grow" />
      <Button
        variant="ghost"
        size="xs"
        class="hover:bg-gray-100"
        @click="clearHistory"
      >
        <div class="i-lucide:trash" />
      </Button>
    </header>
    <div class="flex flex-col overflow-y-scroll nice-scrollbar h-0 flex-grow space-y-2 p-2">
      <div
        v-for="entry in history"
        :key="entry.id"
        class="p-2 rounded bg-gray-50 dark:bg-gray-800"
      >
        <div class="text-xs text-gray-500 dark:text-gray-400">
          {{ formatDate(entry.timestamp) }}
          <span
            v-if="entry.duration"
            class="ml-2"
          >
            ({{ entry.duration.toFixed(2) }}s)
          </span>
        </div>
        <pre class="mt-1 text-sm whitespace-pre-wrap break-all">{{ entry.query }}</pre>
        <div
          v-if="entry.error"
          class="mt-1 text-xs text-red-500"
        >
          {{ entry.error }}
        </div>
      </div>
    </div>
  </div>
</template> 