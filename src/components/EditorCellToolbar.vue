<script setup lang="ts">

import {Button} from "@/components/ui/button";

defineProps({
  play: {default: true},
  save: {default: true},
  clear: {default: true},
  duplicate: {default: true},
  trash: {default: true},
  edit: {default: false},
  update: {default: false},
})

const $emit = defineEmits(["save", "clear", "play", "edit", "update", "duplicate", "trash", "display_results", "moveup", "movedown"]);

</script>

<template>
  <div class="flex space-x-2">
    <Button tabindex="-1" size="xs" data-umami-event="run-cell" class="cursor-pointer" variant="outline" v-if="play" @click="$emit('play')">
      <div class="i-pixelarticons:play h-4 w-4"></div>
    </Button>
    <Button tabindex="-1" size="xs" variant="outline" data-umami-event="clear-cell" v-if="clear" @click="$emit('clear')">
      <div class="i-mingcute:broom-line h-4 w-4"></div>
    </Button>
    <div class="flex-grow"></div>
    <Button tabindex="-1" size="xs" data-umami-event="edit-cell" variant="outline" @click="$emit('edit')" v-if="edit">
      <div class="i-pixelarticons:edit-box h-4 w-4"></div>
    </Button>
    <Button tabindex="-1" size="xs" data-umami-event="update-cell" variant="outline" @click="$emit('update')" v-if="update">
      <div class="i-pixelarticons:close h-4 w-4"></div>
    </Button>
    <Button tabindex="-1" size="xs" data-umami-event="move-cell-up" variant="outline" @click="$emit('moveup')">
      <div class="i-material-symbols-light:arrow-upward-alt-rounded h-4 w-4"></div>
    </Button>
    <Button tabindex="-1" size="xs" data-umami-event="move-cell-down" variant="outline" @click="$emit('movedown')">
      <div class="i-material-symbols-light:arrow-downward-alt-rounded h-4 w-4"></div>
    </Button>
    <!--    <Button tabindex="-1" size="xs" variant="outline" v-if="duplicate" @click="$emit('duplicate')">-->
    <!--      <div class="i-pixelarticons:duplicate h-4 w-4"></div>-->
    <!--    </Button>-->
    <Button tabindex="-1" size="xs" data-umami-event="trash-cell" variant="outline" v-if="trash" @click="$emit('trash')">
      <div class="i-pixelarticons:trash h-4 w-4"></div>
    </Button>
  </div>
</template>

<style scoped></style>