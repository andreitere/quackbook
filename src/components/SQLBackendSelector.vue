<script setup lang="ts">
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useProjects } from '@/store/project.ts';

const $project = useProjects();
const backends = [
    {
        label: 'DuckDB WASM',
        value: 'duckdb_wasm',
        description: 'Run queries directly in your browser',
    },
    {
        label: 'PGLite WASM',
        value: 'pglite_wasm',
        description: 'PostgreSQL-compatible in-browser database',
    },
    {
        label: 'DuckDB Server',
        value: 'duckdb_server',
        description: 'Connect to a remote DuckDB instance with QuackServer',
        link: '/help#sqlbackends',
    },
];

function handleBackendChange() {
    window.location.reload();
}
</script>

<template>
    <div class="space-y-4">
        <h2 class="text-base font-semibold text-gray-900 dark:text-gray-100">
            Choose the SQL Backend
        </h2>
        <RadioGroup
            v-model:model-value="$project.activeProjectMeta.sql.backend"
            default-value="duckdb_wasm"
            class="space-y-3"
            @update:model-value="handleBackendChange"
        >
            <div
                v-for="backend in backends"
                :key="backend.value"
                class="flex items-start space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
                <RadioGroupItem
                    :id="backend.value"
                    :value="backend.value"
                />
                <Label
                    :for="backend.value"
                    class="flex flex-col cursor-pointer"
                >
                    <span class="text-sm font-medium">
                        {{ backend.label }}
                    </span>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                        {{ backend.description }}
                        <a
                            v-if="backend.link"
                            :href="backend.link"
                            class="text-blue-600 dark:text-blue-400 hover:underline ml-1"
                        >
                            Learn more
                        </a>
                    </p>
                </Label>
            </div>

            <div
                v-if="$project.activeProjectMeta.sql.backend == 'duckdb_server'"
                class="mt-4 p-2 rounded-lg bg-gray-50 dark:bg-gray-800"
            >
                <div class="space-y-2">
                    <Label
                        for="host"
                        class="text-xs font-medium"
                    >Server Host</Label>
                    <Input
                        id="host"
                        v-model:model-value="$project.activeProjectMeta.sql.host"
                        type="text"
                        placeholder="eg: http://localhost:8000"
                        class="w-full"
                    />
                </div>
            </div>
        </RadioGroup>
    </div>
</template>

<style scoped>
.radio-group-item {
  @apply focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500;
}
</style>
