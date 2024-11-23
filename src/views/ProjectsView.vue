<script setup lang="ts">
// import {ref} from "vue"
import {Input} from "@/components/ui/input";
import {useProjects} from "@/store/project.ts";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button"

// const tab = ref<string>("local")
const $projects = useProjects()
</script>

<template>
  <div class="page flex flex-col container mx-auto my-10 prose prose-slate dark:prose-invert overflow-y-scroll nice-scrollbar ">
    <div class="flex-grow flex flex-col space-y-6">
      <div class="flex items-center gap-4">
        <h1 class="m-0">Projects</h1>
<!--        <Tabs v-model:model-value="tab" default-value="local" class="w-[400px]">-->
<!--          <TabsList>-->
<!--            <TabsTrigger value="local">-->
<!--              local-->
<!--            </TabsTrigger>-->
<!--            <TabsTrigger value="cloud">-->
<!--              cloud-->
<!--            </TabsTrigger>-->
<!--          </TabsList>-->
<!--        </Tabs>-->
        <div class="flex-grow"></div>
        <Input placeholder="search... (TODO)"/>
      </div>
      <div class="flex-grow flex flex-wrap items-start justify-start h-0 nice-scrollbar overflow-y-scroll gap-2">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card v-for="project in [...$projects.projects]" :key="`project-${project.id}`">
            <CardHeader class="pb-2">
              <CardTitle class="flex justify-between m-0">
                <span>{{ project.name }}</span>
                <Button variant="ghost" @click="$projects.setActiveProject(project)">
                  <div class="i-ic:twotone-folder-open"></div>
                </Button>
              </CardTitle>
              <CardDescription class="m-0">
                {{ project.cells.length }} cell(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div class="text-xs">
                <div v-for="x in project.cells.slice(0,2).map(x => x.query || x.markdown)">
                  {{ x }}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>

</style>