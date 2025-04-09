<script setup lang="ts">

import { useProjects } from "@/store/project.ts";
import { useMetaStore } from "@/store/meta.ts";
import { useClipboard } from "@vueuse/core";
import { useToast } from "@/components/ui/toast";
import { ref } from "vue";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const $projects = useProjects();
const $meta = useMetaStore();
const copySource = ref("");
const { copy } = useClipboard({ source: copySource });
const { toast } = useToast();

const doDownload = () => {
  const project = {
    cells: $projects.activeProjectCells,
    ...$projects.activeProjectMeta
  }
  const jsonString = JSON.stringify(project, null, 2);

  // Create a Blob with the JSON string
  const blob = new Blob([jsonString], { type: 'application/json' });

  // Create a temporary anchor element
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${$projects.activeProjectMeta.name.replace(' ', '_')}.json`;

  // Trigger the download
  document.body.appendChild(a);
  a.click();

  // Clean up
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
}

const doCopy = async (type: string) => {
  let msg = "";
  if (type === "contents") {
    msg = "Project config copied to clipboard";
    copySource.value = $projects.shareableProject;
  }
  if (type === "url") {
    msg = "Project url copied to clipboard";
    copySource.value = $meta.shareLink;
  }
  await copy(copySource.value);
  toast({ title: msg });
  // $meta.shareLink = "";
};
</script>

<template>
  <AlertDialog :open="$meta.shareLink != ''">
    <AlertDialogContent class="max-w-2xl">
      <AlertDialogHeader>
        <AlertDialogTitle class="text-xl font-semibold">
          Share Project
        </AlertDialogTitle>
        <AlertDialogDescription class="text-muted-foreground">
          Share your project "{{ $projects.activeProjectMeta.name }}" with others
        </AlertDialogDescription>
      </AlertDialogHeader>
      <div class="flex flex-col items-stretch gap-6 py-4">
        <input
          v-model="copySource"
          type="text"
          hidden
        >
        <div class="space-y-2">
          <label class="text-sm font-medium">Shareable Link</label>
          <div class="flex w-full items-center gap-2">
            <input
              ref="shareVal"
              type="text"
              class="flex-grow text-sm p-2 rounded-md border bg-muted/50"
              :value="$meta.shareLink"
              readonly
            >
            <Button
              variant="outline"
              size="icon"
              class="shrink-0"
              @click="doCopy('url')"
            >
              <div class="i-lucide:clipboard-copy w-4 h-4" />
            </Button>
          </div>
        </div>

        <div class="flex gap-6 p-4 border rounded-lg bg-muted/30">
          <div class="flex-shrink-0 p-4 border rounded-lg bg-background">
            <div class="i-lucide:file-json w-12 h-12 text-primary" />
          </div>
          <div class="flex-grow space-y-4">
            <div>
              <h3 class="font-semibold text-lg">
                Project Contents
              </h3>
              <p class="text-sm text-muted-foreground">
                Download or copy the project configuration
              </p>
            </div>
            <div class="flex gap-3">
              <Button
                variant="outline"
                class="flex gap-2"
                @click="doDownload"
              >
                <div class="i-lucide:download w-4 h-4" />
                Download
              </Button>
              <Button
                variant="outline"
                class="flex gap-2"
                @click="doCopy('contents')"
              >
                <div class="i-lucide:clipboard-copy w-4 h-4" />
                Copy to Clipboard
              </Button>
            </div>
          </div>
        </div>

        <Alert
          v-if="$meta.shareLink.length > 2048"
          variant="warning"
          class="mt-2"
        >
          <AlertTitle class="flex items-center gap-2">
            <div class="i-mdi:exclamation-thick w-4 h-4" />
            <span>URL Length Warning</span>
          </AlertTitle>
          <AlertDescription class="mt-2">
            <p class="text-sm">
              The generated URL is quite long ({{ $meta.shareLink.length }} characters). Consider:
            </p>
            <ul class="list-disc list-inside text-sm mt-1">
              <li>Reducing the content in your cells</li>
              <li>Splitting the project into smaller parts</li>
            </ul>
            <div class="flex items-center gap-2 mt-3">
              <Button
                variant="outline"
                size="sm"
                class="text-black"
              >
                Login
              </Button>
              <span class="text-sm text-muted-foreground">to share shorter URLs</span>
            </div>
          </AlertDescription>
        </Alert>
      </div>
      <AlertDialogFooter class="gap-2">
        <AlertDialogCancel @click="$meta.shareLink = ''">
          Close
        </AlertDialogCancel>
        <AlertDialogAction
          v-if="$meta.shareLink.length <= 2048"
          data-umami-event="copy-shared-link"
          class="flex gap-2"
          @click="doCopy"
        >
          <div class="i-lucide:clipboard-copy w-4 h-4" />
          Copy & Close
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<style scoped>
/* Add smooth transitions for better UX */
.AlertDialogContent {
  transition: all 0.2s ease-in-out;
}
</style>