<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {computed} from "vue";
import {decodeBase64UrlToJson, expandKeys} from "@/lib/utils.ts";
import {type Project, useProjects} from "@/store/project.ts";
import {projectKeyMap} from "@/lib/constants.ts";

const $route = useRoute();
const $router = useRouter();
const $projects = useProjects();

const parsedProject = computed(() => {
  const project = decodeBase64UrlToJson($route.params.project_json as string);
  return expandKeys(project, projectKeyMap) as Record<string, unknown>;
});

const doImport = () => {
  $projects.importSharedProject(parsedProject.value as Project);
  $router.replace("/");
};
</script>

<template>
  <div class="flex flex-grow flex-col items-center justify-center h-full max-h-full px-2  py-4">
    <Card class="w-[max(400px,90vw)] flex-col flex">
      <CardHeader>
        <CardTitle>Import project</CardTitle>
        <CardDescription>Review and import project</CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col flex-grow max-h-[40vh]">
        <h2 class="font-bold mb-2">{{ parsedProject.name }}</h2>
        <div class="nice-scrollbar overflow-y-scroll flex-grow grid gap-4 grid-cols-2">
          <div v-for="cell in parsedProject.cells" class="p-2 border-2 rounded text-xs whitespace-pre-wrap">
            {{ cell['query'] || cell['markdown'] }}
          </div>
        </div>
      </CardContent>
      <CardFooter class="flex justify-end px-6 pb-6 space-x-2 ">
        <Button variant="outline" @click="$router.replace('/')">
          Cancel
        </Button>
        <Button @click="doImport">Import</Button>
      </CardFooter>
    </Card>
    <pre>
<!--    {{ $route.params.project_json }}-->
  </pre>
  </div>

</template>

<style scoped>

</style>