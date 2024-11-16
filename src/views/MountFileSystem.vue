<script setup lang="ts">

</script>

<template>
  <div class="page flex flex-col container  mx-auto my-10 overflow-y-scroll nice-scrollbar ">
    <div class="h-0 flex-grow">
      <div class="prose prose-slate dark:prose-invert max-w-[1028px]">
        <h1>Mounting File System</h1>
        <p>
          Using files directly from your disk
        </p>
        <h2>Options</h2>
        <div class="flex flex-col space-y-2">
          <h3 class="mt-4 text-xl font-bold">1. Running DuckDB close to your data</h3>
          <p>This involves running a http server from within duckdb via the <a href="https://duckdb.org/community_extensions/extensions/httpserver.html">httpserver</a>
            community extension. This basically turns this whole app into a nice http client 😄</p>
          <p></p>
          <div class="">
            <h4>Prerequisites</h4>
            <p>DuckDB CLI: <a href="https://duckdb.org/docs/installation">https://duckdb.org/docs/installation</a></p>
          </div>
          <div class="flex flex-col">
            <div>
              <h5>Benefits</h5>
              <ul>
                <li>DuckDB will run directly on your PC and not in the browser (better performance)</li>
                <li>ability to easily persist your data</li>
              </ul>
            </div>
            <div>
              <h5>Caveats</h5>
              <ul>
                <li>not as portable</li>
                <li>some data types will be lost but this is specific to this app</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="flex flex-col space-y-2">
          <h2 class="mt-4 text-xl font-bold">2. Simple access over http</h2>
          <p>Run a HTTP server in any folder on your system, allowing DuckDB WASM to access files served by that server.</p>
          <div class="flex gap-4">
            <div class="flex-1">
              <h4 class="font-bold">Using Node</h4>
              <pre class="select-all text-sm">npx serve --cors</pre>
              <span>or</span>
              <pre class="select-all text-sm">npx http-server --cors</pre>
            </div>
            <div class="flex-1">
              <h4 class="font-bold">Using Python</h4>
              <pre class="select-all text-sm">python -m http.server --bind 127.0.0.1</pre>
            </div>
          </div>

          <p>Run one of these commands in the folder you want to make available. <span class="font-semibold">Check which port the server starts on!</span></p>
          <p>Once running, you can point DuckDB to the served files:</p>
          <pre class="select-all text-sm">select * from read_csv_auto("http://localhost:8080/your_file.csv");</pre>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>

</style>