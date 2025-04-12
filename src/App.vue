<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useQuackDuck } from "@/hooks/useQuackDuck.ts";
import { useMetaStore } from "@/store/meta.ts";
import { useMagicKeys } from "@vueuse/core";
import { watch } from "vue";
import { useRoute } from "vue-router";
import Toaster from "@/components/ui/toast/Toaster.vue";
import CommandMenu from "@/components/CommandMenu.vue";
const { playQuack } = useQuackDuck();
const $meta = useMetaStore();
const $route = useRoute();

const { meta, shift, e } = useMagicKeys({
  passive: false,
  onEventFired: (e) => {
    if (e.key === "e" && (e.metaKey || e.ctrlKey) && e.shiftKey)
      e.preventDefault();
  },
});

watch([meta, shift, e], (v) => {
  if (v[0] && v[1] && v[2]) {
    $meta.showToolbar = !$meta.showToolbar;
  }
});
</script>

<template>
  <div class="w-full h-full flex flex-col relative bg-slate-50">
    <header
      class="flex items-center p-2 md:p-4 space-x-3 md:space-x-6 border-b border-slate-200 bg-white shadow-sm sticky top-0 z-50"
    >
      <CommandMenu />

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <router-link
              as-child
              to="/"
              class="group"
            >
              <h1 class="font-bold text-slate-800 transition-colors group-hover:text-slate-900">
                QuackBook
              </h1>
            </router-link>
          </TooltipTrigger>
          <TooltipContent
            align="center"
            hide-when-detached
          >
            <div
              class="cursor-pointer hover:text-slate-600 transition-colors"
              @click="playQuack"
            >
              quack 🦆
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div class="h-[50%] w-[1px] mx-5 bg-slate-200 hidden md:block" />
      <div class="hidden items-center space-x-2 md:flex">
        <router-link
          to="/import"
          class="group"
        >
          <Button
            variant="ghost"
            size="sm"
            class="text-xs transition-colors group-hover:bg-slate-100"
          >
            import
          </Button>
        </router-link>
        <router-link
          to="/about"
          class="group"
        >
          <Button
            variant="ghost"
            size="sm"
            class="text-xs transition-colors group-hover:bg-slate-100"
          >
            about
          </Button>
        </router-link>
      </div>
      <div class="flex flex-grow" />
      <div class="flex items-center space-x-1">
        <a
          href="https://github.com/andreitere/quackbook"
          data-umami-event="github"
          target="_blank"
          class="group"
        >
          <Button
            variant="ghost"
            class="transition-colors group-hover:bg-slate-100"
          >
            <div class="i-bi:github w-5 h-5" />
          </Button>
        </a>
        <Button
          v-if="$route.name === 'workbench'"
          variant="ghost"
          data-umami-event="show-db-schema"
          class="transition-colors hover:bg-slate-100"
          @click="$meta.showToolbar = !$meta.showToolbar"
        >
          <div
            :class="[
              $meta.showToolbar ? `i-octicon:sidebar-collapse-24` : `i-octicon:sidebar-expand-24`,
              'cursor-pointer h-5 w-5 transition-transform duration-200',
              $meta.showToolbar ? 'rotate-180' : ''
            ]"
          />
        </Button>
      </div>
    </header>
    <div class="flex flex-row flex-grow">
      <router-view />
    </div>
    <Toaster />
  </div>
</template>

<style scoped>
.router-link-active {
  @apply text-slate-900 font-medium;
}
</style>
