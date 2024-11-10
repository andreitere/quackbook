<!--<script setup lang="ts">-->

<!--import {Button} from "@/components/ui/button";-->
<!--import {ref} from "vue";-->

<!--const files = ref([])-->

<!--const openDirPicker = async () => {-->
<!--  try {-->
<!--    // Prompt user to select a directory-->
<!--    const dirHandle = await window.showDirectoryPicker();-->
<!--    console.log(dirHandle)-->
<!--    // Clear any existing files list-->
<!--    files.value = [];-->

<!--    // Loop through the directory entries-->
<!--    for await (const entry of dirHandle.values()) {-->
<!--      if (entry.kind === "file") {-->
<!--        console.log(entry)-->
<!--        // Push file info to the files array-->
<!--        // files.value.push({name: entry.name, handle: entry});-->
<!--      }-->
<!--    }-->
<!--  } catch (err) {-->
<!--    console.error("Error selecting directory:", err);-->
<!--  }-->
<!--}-->

<!--</script>-->

<!--<template>-->
<!--  <Button @click="openDirPicker">pick</Button>-->
<!--  <div>-->
<!--    <h2>Select a Directory and List Files</h2>-->
<!--    <button @click="selectDirectory">Select Directory</button>-->
<!--    <ul v-if="files.length">-->
<!--      <li v-for="file in files" :key="file.name">{{ file.name }}</li>-->
<!--    </ul>-->
<!--  </div>-->
<!--</template>-->

<!--<style scoped>-->

<!--</style>-->