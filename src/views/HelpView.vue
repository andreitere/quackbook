<script setup lang="ts">

</script>

<template>
  <div class="page flex flex-col container mx-auto my-10 prose prose-slate dark:prose-invert overflow-y-scroll nice-scrollbar ">
    <div class="h-0 flex-grow ">
      <h1>Help</h1>
      <div>
        <h2>Using local files</h2>
        <div>
          <h3>Option 1: Upload your files</h3>
          <p>This is the easiest option.</p>
          <p>Use <span class="cmd-btn">CMD/CTRL+K</span>, choose <b>import files</b> and then follow the prompts. This will turn your files into tables inside the database</p>
        </div>
        <div>
          <h3>Option 2: Simple access over http</h3>
          <p>Run a HTTP server in any folder on your system, allowing DuckDB WASM to access files served by that server.</p>
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex-1">
              <h4 class="font-bold">
                Using Node
              </h4>
              <pre class="select-all text-sm">npx serve --cors</pre>
              <span>or</span>
              <pre class="select-all text-sm">npx http-server --cors</pre>
            </div>
            <div class="flex-1">
              <h4 class="font-bold">
                Using Python
              </h4>
              <pre class="select-all text-sm">python -m http.server --bind 127.0.0.1</pre>
            </div>
          </div>
          <p>Run one of these commands in the folder you want to make available. <span class="font-semibold">Check which port the server starts on!</span></p>
          <p>Once running, you can point DuckDB to the served files:</p>
          <pre class="select-all text-sm">select * from read_csv_auto("http://localhost:8080/your_file.csv");</pre>
        </div>
        <div>
          <h3>Option 3: work in progress 😊</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>