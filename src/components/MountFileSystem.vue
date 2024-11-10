<script setup lang="ts">

import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {useMetaStore} from "@/store/meta.ts";

const $meta = useMetaStore();
</script>

<template>
  <Dialog v-model:open="$meta.showMountFileSystem">
    <DialogContent class="sm:max-w-[625px]">
      <DialogHeader>
        <DialogTitle class="text-2xl">Mount file system</DialogTitle>
        <DialogDescription>
          Use files on your disk
        </DialogDescription>
      </DialogHeader>
      <div class="flex flex-col space-y-4">
        <p>Currently, there’s no widely supported way to access file system objects (like files and folders) directly from the browser.</p>
        <p>Chrome does support the FileSystem Access API, but other browsers do not. So, directly mounting the file system in the browser isn’t possible.</p>
        <h2 class="mt-4 text-xl font-bold">So, what’s the solution?</h2>
        <p>One option is to run an HTTP server in any folder on your system, allowing DuckDB to access files served by that server.</p>
        <div>
          <h3 class="font-bold">Using NPM</h3>
          <pre class="select-all text-sm">npx serve --cors</pre>
        </div>
        <div>
          <h3 class="font-bold">Using NPM</h3>
          <pre class="select-all text-sm">npx http-server --cors</pre>
        </div>
        <p>Run one of these commands in the folder you want to make available. <span class="font-semibold">Check which port the server starts on!</span></p>
        <p>Once running, you can point DuckDB to the served files:</p>
        <pre class="select-all text-sm">select * from read_csv_auto("http://localhost:8080");</pre>
      </div>
      <DialogFooter>
        <Button data-umami-event="ok-mount-file-system" @click="$meta.showMountFileSystem = false">
          Ok
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<style scoped>

</style>