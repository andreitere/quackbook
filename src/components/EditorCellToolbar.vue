<script setup lang="ts">
import type { ButtonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { ref } from "vue";

defineProps({
  play: { default: true },
  save: { default: true },
  clear: { default: true },
  duplicate: { default: true },
  trash: { default: true },
  edit: { default: false },
  update: { default: false },
  format: { default: false }
});

const $emit = defineEmits([
  "save",
  "clear",
  "play",
  "edit",
  "update",
  "duplicate",
  "trash",
  "display_results",
  "moveup",
  "movedown",
  "format"
]);
const buttonVariant = ref<ButtonVariants["variant"]>("ghost");

</script>

<template>
  <div class="flex space-x-2">
    <Button
      v-if="play"
      tabindex="-1"
      size="xs"
      data-umami-event="run-cell"
      class="cursor-pointer"
      :variant="buttonVariant"
      @click="$emit('play')"
    >
      <div class="i-pixelarticons:play" />
    </Button>
    <Button
      v-if="format"
      tabindex="-1"
      size="xs"
      data-umami-event="format-cell"
      class="cursor-pointer"
      :variant="buttonVariant"
      @click="$emit('format')"
    >
      <div class="i-stash:wand-duotone" />
    </Button>
    <Button
      v-if="clear"
      tabindex="-1"
      size="xs"
      :variant="buttonVariant"
      data-umami-event="clear-cell"
      @click="$emit('clear')"
    >
      <div class="i-mingcute:broom-line" />
    </Button>
    <div class="flex-grow" />
    <Button
      v-if="edit"
      tabindex="-1"
      size="xs"
      data-umami-event="edit-cell"
      :variant="buttonVariant"
      @click="$emit('edit')"
    >
      <div class="i-pixelarticons:edit-box" />
    </Button>
    <Button
      v-if="update"
      tabindex="-1"
      size="xs"
      data-umami-event="update-cell"
      :variant="buttonVariant"
      @click="$emit('update')"
    >
      <div class="i-pixelarticons:close" />
    </Button>
    <Button
      tabindex="-1"
      size="xs"
      data-umami-event="move-cell-down"
      :variant="buttonVariant"
      @click="$emit('movedown')"
    >
      <div class="i-material-symbols-light:arrow-downward-alt-rounded" />
    </Button>
    <Button
      tabindex="-1"
      size="xs"
      data-umami-event="move-cell-up"
      :variant="buttonVariant"
      @click="$emit('moveup')"
    >
      <div class="i-material-symbols-light:arrow-upward-alt-rounded" />
    </Button>
    <!--    <Button tabindex="-1" size="xs" variant="outline" v-if="duplicate" @click="$emit('duplicate')">-->
    <!--      <div class="i-pixelarticons:duplicate"></div>-->
    <!--    </Button>-->
    <Button
      tabindex="-1"
      size="xs"
      data-umami-event="trash-cell"
      :variant="buttonVariant"
      @click="$emit('trash')"
    >
      <div class="i-pixelarticons:trash" />
    </Button>
  </div>
</template>

<style scoped></style>