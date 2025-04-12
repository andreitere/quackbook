<script setup lang="ts">

import { useMetaStore } from "@/store/meta.ts";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";  

const $meta = useMetaStore();
</script>

<template>
  <Dialog v-model:open="$meta.showMountFileSystem">
    <DialogContent class="sm:max-w-[625px]">
      <DialogHeader>
        <DialogTitle class="text-2xl">
          Mount file system
        </DialogTitle>
        <DialogDescription>
          Use files on your disk
        </DialogDescription>
      </DialogHeader>
      <div class="flex flex-col space-y-4 max-w-full overflow-auto">
        <p>
          Currently, there's no widely supported way to access file system objects (like files and folders) directly
          from the browser.
        </p>
        <p>
          Chrome does support the FileSystem Access API, but other browsers do not. So, directly mounting the file
          system in the browser isn't possible.
        </p>
        <h2 class="mt-4 text-xl font-bold">
          So, what's the solution?
        </h2>
        <p>
          To work around this limitation, you can run a local HTTP server in any folder on your system. This allows
          DuckDB to access your files through HTTP requests. Here are some simple options:
        </p>

        <div class="bg-muted p-4 rounded-lg space-y-4">
          <div>
            <h3 class="font-bold text-lg">
              Option 1: Using Node.js (serve)
            </h3>
            <p class="text-sm text-muted-foreground mb-2">
              A simple static file server with CORS enabled
            </p>
            <pre class="bg-background p-2 rounded-md text-sm font-mono select-all">npx serve --cors</pre>
          </div>

          <div>
            <h3 class="font-bold text-lg">
              Option 2: Using Node.js (http-server)
            </h3>
            <p class="text-sm text-muted-foreground mb-2">
              Another popular static file server with CORS support
            </p>
            <pre class="bg-background p-2 rounded-md text-sm font-mono select-all">npx http-server --cors</pre>
          </div>

          <div>
            <h3 class="font-bold text-lg">
              Option 3: Using Python
            </h3>
            <p class="text-sm text-muted-foreground mb-2">
              Python's built-in HTTP server (binds to localhost only)
            </p>
            <pre
              class="bg-background p-2 rounded-md text-sm font-mono select-all"
            >python -m http.server --bind 127.0.0.1</pre>
          </div>
        </div>

        <div class="space-y-2">
          <p class="font-semibold">
            Important notes:
          </p>
          <ul class="list-disc pl-4 space-y-1">
            <li>Run one of these commands in the folder containing your data files</li>
            <li>Note the port number when the server starts (usually 8080, 3000, or 8000)</li>
            <li>Keep the server running while you work with your files</li>
          </ul>
        </div>

        <div class="bg-muted p-4 rounded-lg">
          <p class="mb-2">
            Once your server is running, you can query your files using DuckDB like this:
          </p>
          <pre
            class="bg-background p-2 rounded-md text-sm font-mono select-all whitespace-pre-wrap"
          >select * from read_csv_auto("http://localhost:8080/your_file.csv");</pre>
          <p class="text-sm text-muted-foreground mt-2">
            Replace the port number and filename with your actual values
          </p>
        </div>
      </div>
      <DialogFooter>
        <Button
          data-umami-event="ok-mount-file-system"
          @click="$meta.showMountFileSystem = false"
        >
          Ok
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<style scoped></style>