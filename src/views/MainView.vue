<script setup lang="ts">

import MapView from "@/components/MapView.vue";
</script>

<template>
  <div class="w-full h-full flex flex-col lg:flex-row">
    <MapView :latitude="45.447281667793284" :longitude="25.32862477004528" :zoom="14" class="flex-grow"/>
  </div>
</template>

<style scoped>

</style>