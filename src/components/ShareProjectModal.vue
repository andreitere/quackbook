<script setup lang="ts">

import {useProjects} from "@/store/project.ts";
import {useMetaStore} from "@/store/meta.ts";
import {useClipboard} from "@vueuse/core";
import {useToast} from "@/components/ui/toast";
import {ref} from "vue";

const $projects = useProjects();
const $meta = useMetaStore();
const copySource = ref("");
const {copy} = useClipboard({source: copySource});
const {toast} = useToast();

const doDownload = () => {
  const project = {
    cells: $projects.activeProjectCells,
    ...$projects.activeProjectMeta
  }
  const jsonString = JSON.stringify(project, null, 2);

  // Create a Blob with the JSON string
  const blob = new Blob([jsonString], {type: 'application/json'});

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
  toast({title: msg});
  // $meta.shareLink = "";
};
</script>

<template>
  <AlertDialog :open="$meta.shareLink != ''">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Share project</AlertDialogTitle>
        <AlertDialogDescription>
          {{ $projects.activeProjectMeta.name }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <div class="flex flex-col items-stretch gap-4">
        <input type="text" v-model="copySource" hidden/>
        <div class="flex w-full items-stretch border-2 rounded">
          <input type="text" class="flex-grow  text-sm p-1" :value="$meta.shareLink" ref="shareVal"/>
          <Button variant="ghost" @click="doCopy('url')" class="rounded-none">
            <div class="i-lucide:clipboard-copy w-4 h-4"></div>
          </Button>
        </div>
        <div class="flex gap-4">
          <div class="flex-shrink p-5 border-2 rounded-lg">
            <div class="i-lucide:file-json w-20 h-full text-gray-200"></div>
          </div>
          <div class="flex-grow w-full flex flex-col gap-4  ">
            <h3 class="font-bold">Project Contents</h3>
            <Button variant="outline" class="flex gap-1" @click="doDownload">
              <div class="i-lucide:download w-4 h-4"></div>
              download project file
            </Button>
            <Button variant="outline" class="flex gap-1 " @click="doCopy('contents')">
              <div class="i-lucide:clipboard-copy w-4 h-4"></div>
              copy to clipboard
            </Button>
          </div>
        </div>
        <Alert variant="warning" class="mt-5" v-if="$meta.shareLink.length > 2048">

          <AlertTitle class="flex">
            <div class="i-mdi:exclamation-thick w-4 h-4"></div>
            <span>Generated url looks a bit too long.</span>
          </AlertTitle>
          <AlertDescription>
            <div>
              This is fully based on the content of your cells. Check if you can reduce that a bit or try splitting it in different projects.
              Limit: 2048. Current: {{ $meta.shareLink.length }}
            </div>
            <div class="flex gap-1 items-center mt-2">
              <Button variant="outline" size="sm" class="text-black">Login</Button>
              <span class="text-foreground">to share nicer urls</span>
            </div>

          </AlertDescription>
        </Alert>
      </div>
      <AlertDialogFooter>
        <AlertDialogCancel @click="$meta.shareLink = ''">
          close
        </AlertDialogCancel>
        <AlertDialogAction data-umami-event="copy-shared-link" @click="doCopy" v-if="$meta.shareLink.length <= 2048">Copy & Close</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<style scoped>

</style>