<template>
  <div
    ref="gridRef"
    class="max-h-[300px]"
  />
</template>

<script setup lang="ts">
import { Column, GridAutosizeColsMode, SlickDataView, SlickGrid } from 'slickgrid';
import { ref, useTemplateRef, onMounted } from 'vue';

const gridRef = useTemplateRef("gridRef");
const grid = ref<SlickGrid>();
const dataView = ref<SlickDataView>();

const setData = (data: unknown[]) => {
    dataView.value!.beginUpdate();
    dataView.value!.setItems(data, "_oid");
    dataView.value!.endUpdate();
    grid.value!.render();
}
const setColumns = (columns: { id: string, field: string, label: string }[]) => {
    grid.value!.setColumns(columns as Column[]);
}


defineExpose({
    setData,
    setColumns
})
onMounted(() => {
    dataView.value = new SlickDataView({ inlineFilters: true });
    grid.value = new SlickGrid(gridRef.value!, dataView.value, [], {
        enableCellNavigation: true,
        autosizeColsMode: GridAutosizeColsMode.FitColsToViewport,
        fullWidthRows: true,
        enableAutoSizeColumns: true,
        // forceSyncScrolling: true,
        enableMouseWheelScrollHandler: true,
        enableColumnReorder: false,
    });
    dataView.value.onRowCountChanged.subscribe(function (e, args) {
        grid.value!.updateRowCount();
        grid.value!.render();
    });
});
</script>
<style lang="scss">
.slick-cell {
    @apply text-xs py-[5px] text-gray-500 font-inter;
}

.slick-header-column {
    @apply py-1 h-[25px] text-xs font-semibold font-inter bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800 transition-all duration-200 shadow-sm border-r border-gray-200 tracking-wider hover:from-blue-50 hover:to-blue-100;

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
