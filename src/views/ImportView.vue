<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {computed, ref} from "vue";
import {decodeBase64UrlToJson, expandKeys} from "@/lib/utils.ts";
import {type Project, useProjects} from "@/store/project.ts";
import {projectKeyMap} from "@/lib/constants.ts";
import {Textarea} from "@/components/ui/textarea";

const $route = useRoute();
const $router = useRouter();
const $projects = useProjects();
const fileInput = ref()

const parsedProject = computed(() => {
  if (!$route.params.project_json) return;
  const project = decodeBase64UrlToJson($route.params.project_json as string);
  return expandKeys(project, projectKeyMap) as Record<string, unknown>;
});

const doImport = () => {
  $projects.importSharedProject(parsedProject.value as Project);
  $router.replace("/");
};
</script>

<template>
  <div class="page flex flex-col container mx-auto my-10 prose prose-slate dark:prose-invert overflow-y-scroll nice-scrollbar ">
    <div class="h-0 flex-grow ">
      <h1>Import project</h1>
      <div class="grid md:grid-cols-3 gap-10 px-5">
        <div>
          <h4>paste project config</h4>
          <Textarea class="w-full aspect-square rounded max-w-[300px]" style="resize:none;"></Textarea>
        </div>
        <div>
          <h4>upload file</h4>
          <input type="file" class="w-full aspect-square" ref="fileInput" style="resize:none;" hidden/>
          <div class="w-full aspect-square p-20 bg-gray-100 rounded max-w-[300px]" @click="fileInput.click">
            <div class="i-lucide:import w-full h-full"></div>
          </div>
        </div>
        <div>
          <h4>you have an url?</h4>
          <div class="w-full aspect-square p-2 flex items-center justify-center text-center border-2 border-gray-100 rounded max-w-[300px]"
               @click="doImport">
            <p>just paste it in the address bar and hit enter</p>
          </div>
        </div>
      </div>
    </div>
    <!--  <div class="flex flex-grow flex-col items-center justify-center h-full max-h-full px-2  py-4">-->
    <!--    <Card class="w-[max(400px,90vw)] flex-col flex">-->
    <!--      <CardHeader>-->
    <!--        <CardTitle>Import project</CardTitle>-->
    <!--        <CardDescription>Review and import project</CardDescription>-->
    <!--      </CardHeader>-->
    <!--      <CardContent class="flex flex-col flex-grow max-h-[40vh]">-->
    <!--        <div v-if="parsedProject">-->
    <!--          <h2 class="font-bold mb-2">{{ parsedProject.name }}</h2>-->
    <!--          <div class="nice-scrollbar overflow-y-scroll flex-grow grid gap-4 grid-cols-2">-->
    <!--            <div v-for="cell in parsedProject.cells" class="p-2 border-2 rounded text-xs whitespace-pre-wrap">-->
    <!--              {{ cell['query'] || cell['markdown'] }}-->
    <!--            </div>-->
    <!--          </div>-->
    <!--        </div>-->
    <!--      </CardContent>-->
    <!--      <CardFooter class="flex justify-end px-6 pb-6 space-x-2 ">-->
    <!--        <Button variant="outline" @click="$router.replace('/')">-->
    <!--          Cancel-->
    <!--        </Button>-->
    <!--        <Button @click="doImport">Import</Button>-->
    <!--      </CardFooter>-->
    <!--    </Card>-->
    <!--    <pre>-->
    <!--&lt;!&ndash;    {{ $route.params.project_json }}&ndash;&gt;-->
    <!--  </pre>-->
  </div>

</template>

<style scoped>

</style>