<script setup lang="ts">
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group'
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {useProjects} from "@/store/project.ts";
const $project = useProjects()
const backends = [
  {
    label: "DuckDB WASM",
    value: "duckdb_wasm",
  },
  {
    label: "DuckDB Server",
    value: "duckdb_server",
    link: "/help#sqlbackends"
  },
  // {
  //   label: "PGLite WASM",
  //   value: "pglite_wasm",
  // }
]
</script>

<template>
  <h2 class="mb-2">Choose the SQL Backend</h2>
  <RadioGroup default-value="duckdb_wasm" class="text-sm" v-model:model-value="$project.activeProject.sql.backend">
    <div class="flex items-center space-x-2 " v-for="backend in backends">
      <RadioGroupItem :id="backend.value" :value="backend.value"/>
      <Label class="cursor-pointer" :for="backend.value">{{ backend.label }}</Label>
      <span v-if="backend.link">(<a :href="backend.link" class="underline">read more</a>)</span>
    </div>
    <div class="flex w-full max-w-sm items-center gap-1.5" v-if="$project.activeProject.sql.backend=='duckdb_server'">
      <Label for="host">Host</Label>
      <Input id="host" type="text" placeholder="eg: http://localhost:8000" v-model:model-value="$project.activeProject.sql.host"/>
    </div>
  </RadioGroup>
</template>

<style scoped>

</style>