<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { computed, ref, watch } from "vue";
import { decodeBase64UrlToJson, expandKeys } from "@/lib/utils.ts";
import { useProjects } from "@/store/project.ts";
import { projectKeyMap } from "@/lib/constants.ts";
import Ajv from "ajv";
import projectSchemaRaw from "@/lib/schemas/project.schema.json"
import { useToast } from "@/components/ui/toast";
import { Textarea } from "@/components/ui/textarea";
const { toast } = useToast()

const ajv = new Ajv();
const projectSchema = ajv.compile(projectSchemaRaw);

const $route = useRoute();
const $router = useRouter();
const $projects = useProjects();
const fileInput = ref()
const configInput = ref("");
const parsedProject = computed(() => {
  if (!$route.params.project_json) return;
  const project = decodeBase64UrlToJson($route.params.project_json as string);
  return expandKeys(project, projectKeyMap) as Record<string, unknown>;
});

const isLoading = ref(false);
const isDragging = ref(false);

const doImport = () => {
  $projects.importSharedProject(parsedProject.value as Project);
  $router.replace("/");
};

const onProjectUploaded = (event: Event) => {
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
};

const onDragOver = (e: DragEvent) => {
  e.preventDefault();
  isDragging.value = true;
};

const onDragLeave = () => {
  isDragging.value = false;
};

const onDrop = async (e: DragEvent) => {
  e.preventDefault();
  isDragging.value = false;
  const file = e.dataTransfer?.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    tryImport(e.target?.result);
  };
  reader.readAsText(file);
};

const tryImport = (v: unknown) => {
  if (!v) return;
  isLoading.value = true;
  let _project = v as string;
  let wasFromUrl = false;

  try {
    if (_project.includes("/import/")) {
      _project = _project.split("/import/")[1];
      wasFromUrl = true;
    }

    try {
      _project = decodeBase64UrlToJson(_project);
    } catch (e) {
      console.warn(`${v} is not a valid project.`);
    }

    if (!wasFromUrl) {
      //@ts-ignore
      _project = JSON.parse(_project) as SomeObj;
    }
    //@ts-ignore
    const _maybeProject = expandKeys(_project, projectKeyMap) as Project;
    const valid = projectSchema(_maybeProject);
    if (valid) {
      //@ts-ignore
      $projects.importSharedProject(_maybeProject);
      $router.push("/")
    } else {
      toast({
        title: "Import error",
        description: "Project configuration doesn't seem to be valid.",
        variant: "destructive"
      })
    }
  } catch (e) {
    toast({
      title: "Import error",
      description: "Failed to import project. Please check the format and try again.",
      variant: "destructive"
    })
  } finally {
    isLoading.value = false;
  }
}

watch(configInput, (v) => {
  tryImport(v)
})

</script>

<template>
  <main class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center w-full">
    <div class="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header class="text-center mb-16">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Import Project
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          Choose a method to import your project configuration
        </p>
      </header>

      <section class="grid md:grid-cols-3 gap-6">
        <!-- Paste Config Section -->
        <article class="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h2
            class="text-base font-medium text-gray-900 dark:text-white p-4 flex items-center gap-2 border-b border-gray-100 dark:border-gray-700"
          >
            <div class="i-lucide:clipboard text-lg" />
            Paste Configuration
          </h2>
          <div class="p-4">
            <Textarea
              v-model="configInput"
              class="w-full aspect-square rounded-md border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
              style="resize:none;"
              placeholder="Paste your project configuration here..."
            />
          </div>
        </article>

        <!-- Upload File Section -->
        <article class="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h2
            class="text-base font-medium text-gray-900 dark:text-white p-4 flex items-center gap-2 border-b border-gray-100 dark:border-gray-700"
          >
            <div class="i-lucide:upload text-lg" />
            Upload File
          </h2>
          <div class="p-4">
            <div
              class="aspect-square"
              @dragover="onDragOver"
              @dragleave="onDragLeave"
              @drop="onDrop"
            >
              <input
                ref="fileInput"
                type="file"
                class="hidden"
                accept=".json"
                @change="onProjectUploaded"
              >
              <button
                class="w-full h-full flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg transition-colors"
                :class="{
                  'border-blue-500 bg-blue-50 dark:bg-blue-900/20': isDragging,
                  'border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500': !isDragging
                }"
                @click="fileInput.click"
              >
                <div class="i-lucide:upload-cloud w-12 h-12 mb-3 text-gray-400 dark:text-gray-500" />
                <p class="text-sm text-gray-600 dark:text-gray-300 text-center">
                  Click to upload or drag and drop
                  <br>JSON files only
                </p>
              </button>
            </div>
          </div>
        </article>

        <!-- URL Section -->
        <article class="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h2
            class="text-base font-medium text-gray-900 dark:text-white p-4 flex items-center gap-2 border-b border-gray-100 dark:border-gray-700"
          >
            <div class="i-lucide:link text-lg" />
            Use URL
          </h2>
          <div class="p-4">
            <button
              class="w-full aspect-square flex items-center justify-center p-6 border-2 rounded-lg transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
              @click="doImport"
            >
              <p class="text-sm text-gray-600 dark:text-gray-300 text-center">
                Simply paste your project URL in the address bar and press Enter
              </p>
            </button>
          </div>
        </article>
      </section>

      <!-- Loading Overlay -->
      <div
        v-if="isLoading"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="animate-spin i-lucide:loader-2 w-12 h-12 text-white" />
      </div>
    </div>
  </main>
</template>

<style scoped>
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