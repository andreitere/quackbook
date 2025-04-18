<script setup lang="ts">
import type perspective from '@finos/perspective';
import { getPerspectiveWorker } from '@/lib/perspective';
import { onMounted, reactive, ref } from 'vue';
// import PerspectiveElement from "@finos/perspective-viewer";
import '@finos/perspective-viewer';
import '@finos/perspective-viewer-datagrid';
import '@finos/perspective-viewer-d3fc';

const pViewer = ref();
const p = reactive({
    worker: null as Awaited<ReturnType<typeof perspective.worker>> | null,
    table: null as unknown | null,
});

async function showTable(schema: Record<string, unknown>, data: Record<string, unknown>[]) {
    // Remap schema to {colName: type}

    // Get JSON columns for efficient processing
    const jsonColumns = Object.entries(schema)
        .filter(([_, type]) => type === 'json')
        .map(([col]) => col);

    await doSetup.value;
    const _data = [];

    // Process data in a single pass
    for (const row of data) {
        // Only process JSON columns if they exist
        if (jsonColumns.length > 0) {
            for (const col of jsonColumns) {
                if (col in row) {
                    row[col] = JSON.stringify(row[col]);
                }
            }
        }

        _data.push(row);
    }
    console.log('show table', schema);

    if (!p.worker)
        throw new Error('Perspective worker not initialized');
    p.table = await p.worker.table(schema);
    // p.table!.update(_data);
    if (!pViewer.value)
        throw new Error('Perspective viewer not mounted');

    // Configure viewer to show raw date values

    await pViewer.value.load(p.table);
    await pViewer.value.restore({
        plugin: 'Datagrid',
        settings: false,
        plugin_config: {
            datetime_format: 'raw',
        },
    });
}

/**
 * Adds additional data to the existing table
 * @param data Additional records to add to the table
 */
async function addData(data: Record<string, unknown>[]) {
    if (!p.table) {
        console.error('Table not initialized. Call showTable first.');
        return;
    }

    // @ts-ignore
    const schema = await p.table.schema();

    // Get JSON columns for efficient processing
    const jsonColumns = Object.entries(schema)
        .filter(([_, type]) => type === 'json')
        .map(([col]) => col);

    const _data = [];

    // Process data in a single pass
    for (const row of data) {
        // Only process JSON columns if they exist
        if (jsonColumns.length > 0) {
            for (const col of jsonColumns) {
                if (col in row) {
                    row[col] = JSON.stringify(row[col]);
                }
            }
        }

        _data.push(row);
    }

    // @ts-ignore
    await p.table.update(data);
}

defineExpose({
    showTable,
    addData,
});

const doSetup = ref<Promise<void>>();

onMounted(async () => {
    doSetup.value = new Promise(async (resolve) => {
        p.worker = getPerspectiveWorker();
        resolve();
    });
});
</script>

<template>
    <perspective-viewer ref="pViewer" />
</template>

<style lang="scss">
.slick-cell {
    @apply text-xs py-[5px] text-gray-500;
}

.slick-header-column {
    @apply py-1 h-[25px] text-xs font-semibold bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800 transition-all duration-200 shadow-sm border-r border-gray-200 tracking-wider hover:from-blue-50 hover:to-blue-100;

    &:hover {
        @apply bg-gray-100 cursor-pointer;
    }

    &.slick-header-column-sorted {
        @apply bg-blue-50 text-blue-700 font-semibold;
    }

    .slick-sort-indicator {
        @apply ml-1 opacity-80;
    }

    &.ui-state-default {
        @apply border-gray-200;
    }
}

.slick-header-columns {
    @apply border-b border-gray-200;
}
</style>
