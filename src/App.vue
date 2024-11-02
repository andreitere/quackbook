<script setup lang="ts">
import {useColorMode, useMagicKeys} from '@vueuse/core'
import {Button} from "@/components/ui/button";
import {reactive, watch} from "vue";


const mode = useColorMode() // Ref<'dark' | 'light'>
const toggleColorMode = () => {
  if (mode.value === 'light') {
    mode.value = 'dark';
  } else {
    mode.value = 'light'
  }
}

const show = reactive({
  toolBar: false,
  utilsBar: false,
})

const keys = useMagicKeys();

const cmdShiftE = keys['Option+Shift+E'];

watch(cmdShiftE, (v) => {
  if (!v) return;
  console.log(`cmdShiftE`, v);
  show.toolBar = !show.toolBar;
})

</script>

<template>
  <div class="w-full h-full flex md:flex-row relative">
    <div class="tool-bar w-[40px] bg-blue-300" v-if="show.toolBar"></div>
    <div class="main flex-grow">
      <div class="i-fluent-emoji:duck h-[200px] w-[200px]"/>
      <Button>
        hey, cris
      </Button>
    </div>
    <div class="utils-bar bg-green-300"></div>
  </div>
</template>

<style scoped>

</style>
