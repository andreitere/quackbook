<script setup lang="ts">
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { projectKeyMap } from '@/lib/constants.ts';
import projectSchemaRaw from '@/lib/schemas/project.schema.json';
import { decodeBase64UrlToJson, expandKeys } from '@/lib/utils.ts';
import { useProjects } from '@/store/project.ts';
import Ajv from 'ajv';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const { toast } = useToast();
const ajv = new Ajv();
const projectSchema = ajv.compile(projectSchemaRaw);
const $route = useRoute();

const $projects = useProjects();
const searchQuery = ref('');
const fileInput = ref<HTMLInputElement>();
const isDragging = ref(false);
const isLoading = ref(false);
const projectToDelete = ref<Project | null>(null);
const showDeleteDialog = ref(false);

onMounted(() => {
    // Handle project import from URL
    if ($route.params.projectData) {
        tryImport($route.params.projectData);
    }
});

const filteredProjects = computed(() => {
    if (!searchQuery.value) {
        return $projects.projects;
    }
    const query = searchQuery.value.toLowerCase();
    return $projects.projects.filter(project =>
        project.name.toLowerCase().includes(query)
        || project.cells.some(cell =>
            (cell.query?.toLowerCase().includes(query))
            || (cell.markdown?.toLowerCase().includes(query)),
        ),
    );
});

function deleteProject(project: Project) {
    projectToDelete.value = project;
    showDeleteDialog.value = true;
}

function confirmDelete() {
    if (!projectToDelete.value) {
        return;
    }

    const projectName = projectToDelete.value.name;
    $projects.projects = $projects.projects.filter(p => p.id !== projectToDelete.value?.id);
    projectToDelete.value = null;
    showDeleteDialog.value = false;

    toast({
        title: 'Project deleted',
        description: `Project "${projectName}" has been deleted.`,
    });
}

function onProjectUploaded(event: Event) {
    const _files = (event.target as HTMLInputElement).files;
    const file = _files?.[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        tryImport(e.target?.result);
    };
    reader.readAsText(file);
}

function onDragOver(e: DragEvent) {
    e.preventDefault();
    isDragging.value = true;
}

function onDragLeave() {
    isDragging.value = false;
}

async function onDrop(e: DragEvent) {
    e.preventDefault();
    isDragging.value = false;
    const file = e.dataTransfer?.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        tryImport(e.target?.result);
    };
    reader.readAsText(file);
}

function tryImport(v: unknown) {
    if (!v) {
        return;
    }
    isLoading.value = true;
    let projectData: any;

    try {
        projectData = $route.params.projectData;
        // Handle URL imports
        if (projectData) {
            try {
                projectData = decodeBase64UrlToJson(projectData as string);
            }
            catch {
                throw new Error('Invalid base64 encoded project data');
            }
        }
        else {
            // Handle direct JSON imports
            try {
                projectData = JSON.parse(v as string) as Record<string, unknown>;
            }
            catch {
                throw new Error('Invalid JSON format');
            }
        }

        // Expand keys and validate schema
        const _maybeProject = expandKeys(projectData, projectKeyMap) as Project;
        const valid = projectSchema(_maybeProject);

        if (!valid) {
            throw new Error('Invalid project schema');
        }

        // Import the project
        $projects.importSharedProject(_maybeProject);

        // Show success message
        toast({
            title: 'Project imported successfully!',
            description: 'The project has been imported and is now available in your projects list.',
        });

        // Redirect to the project edit page
        window.location.href = '/';
    }
    catch (error) {
        toast({
            title: 'Import error',
            description: error instanceof Error ? error.message : 'Failed to import project. Please check the format and try again.',
            variant: 'destructive',
        });
    }
    finally {
        isLoading.value = false;
    }
}
</script>

<template>
    <div
        class="page flex flex-col container mx-auto my-10 prose prose-slate dark:prose-invert overflow-y-scroll nice-scrollbar "
    >
        <div class="flex-grow flex flex-col space-y-6">
            <div class="flex items-center gap-4 py-2">
                <h1 class="m-0 text-3xl font-bold">
                    Projects
                </h1>
                <div class="flex-grow" />
                <div class="flex items-center gap-4">
                    <div class="relative w-64">
                        <Input
                            v-model="searchQuery"
                            placeholder="Search projects..."
                            class="pl-8"
                        />
                        <div class="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground">
                            <div class="i-ic:twotone-search" />
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        class="relative"
                        @click="fileInput?.click()"
                    >
                        <div class="i-lucide:upload-cloud mr-2" />
                        Import Project
                        <input
                            ref="fileInput"
                            type="file"
                            class="hidden"
                            accept=".json"
                            @change="onProjectUploaded"
                        >
                    </Button>
                </div>
            </div>
            <div
                class="flex-grow flex flex-wrap items-start justify-start h-0 nice-scrollbar overflow-y-scroll gap-2"
                :class="{ 'bg-blue-50 dark:bg-blue-900/20': isDragging }"
                @dragover="onDragOver"
                @dragleave="onDragLeave"
                @drop="onDrop"
            >
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                    <Card
                        v-for="project in filteredProjects"
                        :key="`project-${project.id}`"
                        class="hover:shadow-lg transition-shadow duration-200"
                    >
                        <CardHeader class="pb-2">
                            <CardTitle class="flex justify-between items-center m-0">
                                <span class="truncate max-w-[200px]">{{ project.name }}</span>
                                <div class="flex items-center gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        class="h-8 w-8"
                                        @click="deleteProject(project)"
                                    >
                                        <div class="i-lucide:trash-2 text-lg text-destructive" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        class="h-8 w-8"
                                        @click="$projects.setActiveProject(project)"
                                    >
                                        <div class="i-ic:twotone-folder-open text-lg" />
                                    </Button>
                                </div>
                            </CardTitle>
                            <CardDescription class="m-0 flex items-center gap-1">
                                <div class="i-ic:twotone-code text-sm" />
                                {{ project.cells.length }} cell(s)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div class="text-xs space-y-1 text-muted-foreground">
                                <div
                                    v-for="(x, index) in project.cells.slice(0, 2).map(x => x.query || x.markdown)"
                                    :key="`cell-${index}`"
                                    class="truncate"
                                >
                                    {{ x }}
                                </div>
                                <div v-if="project.cells.length > 2" class="text-xs text-muted-foreground">
                                    +{{ project.cells.length - 2 }} more cells
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
        <!-- Loading Overlay -->
        <div
            v-if="isLoading"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
            <div class="animate-spin i-lucide:loader-2 w-12 h-12 text-white" />
        </div>

        <!-- Delete Confirmation Dialog -->
        <AlertDialog v-model:open="showDeleteDialog">
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Project</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete "{{ projectToDelete?.name }}"? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel @click="showDeleteDialog = false">
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction class="bg-destructive text-destructive-foreground hover:bg-destructive/90" @click="confirmDelete">
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
</template>

<style scoped>
.nice-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: var(--color-muted) transparent;
}

.nice-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.nice-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.nice-scrollbar::-webkit-scrollbar-thumb {
    background-color: var(--color-muted);
    border-radius: 3px;
}

.animate-spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
</style>
