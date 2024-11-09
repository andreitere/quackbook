<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {computed} from "vue";
import {decodeBase64UrlToJson} from "@/lib/utils.ts";
import {useProjects} from "@/store/project.ts";

const $route = useRoute()
const $router = useRouter()
const $projects = useProjects();

const parsedProject = computed(() => {
  return decodeBase64UrlToJson($route.params.project_json as string)
})

const doImport = () => {
  $projects.importSharedProject(parsedProject.value);
  $router.replace("/")
}

</script>

<template>
  <div class="flex flex-grow flex-col items-center justify-center h-full max-h-full px-2  py-4">
    <Card class="w-[max(600px,90vh)]">
      <CardHeader>
        <CardTitle>Import project</CardTitle>
        <CardDescription>Review and import project</CardDescription>
      </CardHeader>
      <CardContent>
        <h2 class="font-bold">{{ parsedProject.name }}</h2>
        <div v-for="cell in parsedProject.cells" class="my-2 p-2 border-2 rounded text-sm">
          {{ cell.query }}
        </div>
      </CardContent>
      <CardFooter class="flex justify-center px-6 pb-6 space-x-2">
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