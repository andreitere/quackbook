<script setup lang="ts">
import {Tabs, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {ref} from "vue"
import {Input} from "@/components/ui/input";
import {useProjects} from "@/store/project.ts";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";

const tab = ref<string>("local")
const $projects = useProjects()
</script>

<template>
  <div class="page flex flex-col container mx-auto my-10 prose prose-slate dark:prose-invert overflow-y-scroll nice-scrollbar ">
    <div class="flex-grow flex flex-col">
      <div class="flex items-center gap-4">
        <h1 class="m-0">Projects</h1>
        <Tabs v-model:model-value="tab" default-value="local" class="w-[400px]">
          <TabsList>
            <TabsTrigger value="local">
              local
            </TabsTrigger>
            <TabsTrigger value="cloud">
              cloud
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div class="flex-grow"></div>
        <Input placeholder="search..."/>
      </div>
      <div class="flex-grow flex flex-wrap items-start justify-start h-0 nice-scrollbar overflow-y-scroll gap-4">
        <Card v-for="project in [...$projects.projects]" :key="`project-${project.id}`">
          <CardHeader>
            <CardTitle class="m-0">{{project.name}}</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            Card Content
          </CardContent>
          <CardFooter>
            Card Footer
          </CardFooter>
        </Card>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>