<script setup lang="ts">
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/store/project.ts";
import { computed } from "vue";

const $projects = useProjects();

const anyNotifications = computed(() => {
	if ($projects.activeProject.value.dirty) return true;
});
</script>

<template>
  <HoverCard :open-delay="50">
    <HoverCardTrigger as-child>
      <Button variant="outline" size="sm"  :class="[anyNotifications ? 'text-red-600': 'text-gray-200']">
        <div class="i-material-symbols-light:notifications-active"></div>
      </Button>
    </HoverCardTrigger>
    <HoverCardContent class="w-80">
      <div class="flex justify-between space-x-4" v-if="anyNotifications">
        <div class="space-y-1">
          <h4 class="text-sm font-bold">
            Project not saved
          </h4>
          <p class="text-sm">
            Make sure you save your project. Use <span class="font-bold">CMD/Ctrl + K</span>
          </p>
        </div>
      </div>
      <div v-else>
        <p class="text-center">no notifications 😋</p>
      </div>
    </HoverCardContent>
  </HoverCard>
</template>

<style scoped>

</style>