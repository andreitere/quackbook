<script setup lang="ts">
import DBSchemaDetails from '@/components/DBSchemaDetails.vue';
import EditableProjectName from '@/components/EditableProjectName.vue';
import EditorCell from '@/components/EditorCell.vue';
import FileImport from '@/components/FileImport.vue';
import MarkdownCell from '@/components/MarkdownCell.vue';
import MountFileSystem from '@/components/MountFileSystem.vue';
import NotificationsCard from '@/components/NotificationsCard.vue';
import QueryHistory from '@/components/QueryHistory.vue';
import ShareProjectModal from '@/components/ShareProjectModal.vue';
import SQLBackendSelector from '@/components/SQLBackendSelector.vue';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useDuckDb } from '@/hooks/useDuckDb.ts';
import { useMetaStore } from '@/store/meta.ts';
import { useProjects } from '@/store/project.ts';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

const $meta = useMetaStore();
const $projects = useProjects();
const $route = useRoute();
const { loading: db_loading } = useDuckDb();

onMounted(() => {
    if ($route.query.quackMode) {
        $projects.activeProjectMeta.sql.backend = 'duckdb_server';
        $projects.activeProjectMeta.sql.host = `http://localhost:${$route.query.serverPort}`;
        window.location.href = '/';
    }
});
</script>

<template>
    <div class="flex flex-grow w-1/3 flex-col h-full max-h-full p-6 bg-gray-300 dark:bg-zinc-800">
        <div class="flex justify-start items-center gap-2 text-gray-600 mb-6 dark:text-gray-300">
            <div v-if="db_loading" class="flex items-center justify-center w-full">
                <div class="i-line-md:loading-twotone-loop w-5 h-5" />
                initializing duck db ❤
            </div>
            <div v-else class="flex gap-2 items-center w-full flex-col md:flex-row">
                <div class="flex flex-grow space-x-2 w-full items-center">
                    <EditableProjectName class="flex-grow" />
                    <NotificationsCard />
                    <Popover>
                        <PopoverTrigger as-child>
                            <Button variant="outline" size="sm" class="shadow-sm">
                                <div class="i-material-symbols:settings-cinematic-blur-outline-rounded w-4-h-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent class="w-80">
                            <SQLBackendSelector />
                        </PopoverContent>
                    </Popover>
                </div>
                <div class="flex flex-grow" />
                <div class="flex md:min-w-0 max-w-[100vw] flex-grow px-2 md:px-0 w-full">
                    <div class="overflow-x-scroll min-w-full nice-scrollbar flex space-x-2 items-center md:justify-end">
                        <Button
                            class="flex-grow md:flex-grow-0 shadow-sm" variant="outline" size="sm"
                            @click="$projects.addCell('markdown', null)"
                        >
                            <div class="i-ion:logo-markdown" />
                            <span class="ml-1 hidden md:block">add md</span>
                        </Button>

                        <Button
                            class="flex-grow md:flex-grow-0 shadow-sm" variant="outline" size="sm"
                            @click="$projects.addCell('sql', null)"
                        >
                            <div class="i-hugeicons:sql" />
                            <span class="ml-1 hidden md:block">add sql</span>
                        </Button>
                        <Button
                            class="flex-grow md:flex-grow-0 shadow-sm" variant="outline" size="sm"
                            @click="$projects.saveProject"
                        >
                            <div class="i-lucide:save" />
                            <span class="ml-1 hidden md:block">save</span>
                        </Button>
                        <Button
                            class="flex-grow md:flex-grow-0 shadow-sm" variant="outline" size="sm"
                            @click="$projects.shareProject"
                        >
                            <div class="i-lucide:share" />
                            <span class="ml-1 hidden md:block">share</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>

        <div class="overflow-y-scroll nice-scrollbar flex flex-col h-0 flex-grow space-y-6 pb-[200px] py-2">
            <div v-for="cell in $projects.sortedCells" :key="`${cell.position}-${cell.id}`" class="w-full">
                <EditorCell v-if="cell.type == 'sql'" :id="cell.id" v-model:query="cell.query" :position="cell.position" />
                <MarkdownCell
                    v-if="cell.type == 'markdown'" :id="cell.id" v-model:markdown="cell.markdown"
                    :position="cell.position"
                />
            </div>
        </div>
    </div>
    <div
        class="tool-bar items-center flex flex-col space-y-3 h-full" :class="[
            $meta.showToolbar ? 'flex-grow w-[max(450px)] max-w-[max(450px)]' : 'w-0 opacity-0',
        ]"
    >
        <DBSchemaDetails class="w-full" />
        <QueryHistory class="w-full" />
    </div>
    <ShareProjectModal />
    <FileImport />
    <MountFileSystem />
</template>

<style scoped>
.nice-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.nice-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.nice-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.dark .nice-scrollbar::-webkit-scrollbar-thumb {
  background: #475569;
}
</style>
