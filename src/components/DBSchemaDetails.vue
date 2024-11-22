<script setup lang="ts">
import {type DataModelNode, useDBSchema} from "@/store/dbSchema.ts";
import {db_events} from "@/store/meta.ts";
import {BaseTree} from "@he-tree/vue";
import "@he-tree/vue/style/default.css";
import {onMounted, ref, watch} from "vue";

const {updateSchemaDetails, schemaTree} = useDBSchema();
const events = ref<string[]>([]);
const _schemaTree = ref<DataModelNode[]>([]);

watch(schemaTree, () => {
  _schemaTree.value = schemaTree.value;
});

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
  <div class="space-y-2 my-2">
    <div v-if="schemaTree == null" class="text-center p-2">no tables yet ✨</div>
    <!--    <TreeView  id="my-tree" v-model="_schemaTree" v-else class="">-->
    <!--      <template #expander="{toggleNodeExpanded, metaModel: {data}}">-->
    <!--        <button @click="toggleNodeExpanded" :class="['i-solar:database-bold-duotone w-5 h-5', data.type]" v-if="data.type == 'database'"></button>-->
    <!--        <button @click="toggleNodeExpanded" :class="['i-material-symbols:schema-outline-rounded w-5 h-5', data.type]" v-if="data.type == 'schema'"></button>-->
    <!--        <button @click="toggleNodeExpanded" :class="['i-material-symbols:table-rows w-5 h-5', data.type]" v-if="data.type == 'table'"></button>-->
    <!--      </template>-->
    <!--    </TreeView>-->
    <BaseTree v-model="_schemaTree" ref="tree" :default-open="true">
      <template #default="{ node, stat }">
        <div class="flex gap-1">
          <button @click="stat.open = !stat.open">
            <div
                v-if="node.type === 'database'"
                :class="[
              'w-4 h-4 transition-all duration-200',
              stat.open ? 'i-iconoir:database-search': 'i-iconoir:database-solid'
            ]"></div>
            <div
                v-if="node.type === 'schema'"
                :class="[
              'w-4 h-4',
              stat.open ? 'i-lucide:folder-open': 'i-lucide:folder'
            ]"></div>
            <div
                v-if="node.type === 'table'"
                :class="[
              'w-4 h-4',
              stat.open ? 'i-lucide:table-properties': 'i-lucide:table-2'
            ]"></div>
            <div
                v-if="node.type === 'column'"
                :class="[
              'w-3 h-3 i-lucide:columns-2',

            ]"></div>
          </button>
          <span :class="[
              node.type === 'column' ? 'text-sm': ''
          ]">{{ node.label }}</span>
        </div>
      </template>
    </BaseTree>
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