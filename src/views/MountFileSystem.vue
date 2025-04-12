<script setup lang="ts">

</script>

<template>
  <div class="page flex flex-col container mx-auto my-10 overflow-y-scroll nice-scrollbar">
    <div class="h-0 flex-grow">
      <div class="prose prose-slate dark:prose-invert max-w-[1028px]">
        <h1>Mounting File System</h1>
        <p class="text-lg">
          Access and analyze your local files directly with DuckDB. Choose from two different approaches:
        </p>

        <div class="flex flex-col space-y-6">
          <div class="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg">
            <h3 class="text-2xl font-bold text-primary-600 dark:text-primary-400">
              1. Running DuckDB Locally
            </h3>
            <p class="mt-2">
              This approach uses DuckDB's <a
                href="https://duckdb.org/community_extensions/extensions/httpserver.html"
                class="text-primary-600 dark:text-primary-400 hover:underline"
              >httpserver extension</a> to run DuckDB directly on your machine, 
              while this application acts as a user-friendly interface to interact with it.
            </p>

            <div class="mt-4">
              <h4 class="font-semibold text-lg">
                Prerequisites
              </h4>
              <p>
                Install the DuckDB CLI from the <a
                  href="https://duckdb.org/docs/installation"
                  class="text-primary-600 dark:text-primary-400 hover:underline"
                >official documentation</a>
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div class="bg-white dark:bg-slate-700 p-4 rounded-lg">
                <h5 class="font-semibold text-primary-600 dark:text-primary-400">
                  Benefits
                </h5>
                <ul class="list-disc pl-4 mt-2 space-y-1">
                  <li>Native performance - DuckDB runs directly on your PC</li>
                  <li>Full data persistence capabilities</li>
                  <li>Access to all DuckDB features</li>
                </ul>
              </div>
              <div class="bg-white dark:bg-slate-700 p-4 rounded-lg">
                <h5 class="font-semibold text-primary-600 dark:text-primary-400">
                  Considerations
                </h5>
                <ul class="list-disc pl-4 mt-2 space-y-1">
                  <li>Requires local installation</li>
                  <li>Some data type conversions may occur</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg">
            <h3 class="text-2xl font-bold text-primary-600 dark:text-primary-400">
              2. HTTP Server Access
            </h3>
            <p class="mt-2">
              A simpler approach that uses a local HTTP server to make your files accessible to DuckDB WASM. 
              This method is great for quick access and testing.
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div class="bg-white dark:bg-slate-700 p-4 rounded-lg">
                <h4 class="font-semibold text-lg text-primary-600 dark:text-primary-400">
                  Node.js Method
                </h4>
                <div class="mt-2 space-y-2">
                  <div class="bg-slate-100 dark:bg-slate-600 p-2 rounded">
                    <code class="text-sm font-mono">npx serve --cors</code>
                  </div>
                  <p class="text-sm text-slate-600 dark:text-slate-300">
                    or
                  </p>
                  <div class="bg-slate-100 dark:bg-slate-600 p-2 rounded">
                    <code class="text-sm font-mono">npx http-server --cors</code>
                  </div>
                </div>
              </div>

              <div class="bg-white dark:bg-slate-700 p-4 rounded-lg">
                <h4 class="font-semibold text-lg text-primary-600 dark:text-primary-400">
                  Python Method
                </h4>
                <div class="mt-2">
                  <div class="bg-slate-100 dark:bg-slate-600 p-2 rounded">
                    <code class="text-sm font-mono">python -m http.server --bind 127.0.0.1</code>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-6">
              <p class="font-semibold">
                Important Notes:
              </p>
              <ul class="list-disc pl-4 mt-2 space-y-1">
                <li>Run these commands in the folder containing your data files</li>
                <li>Note the port number when the server starts (usually 8080 or 3000)</li>
                <li>Make sure to enable CORS for the server to work properly</li>
              </ul>
            </div>

            <div class="mt-6">
              <p>Once your server is running, you can query your files using DuckDB:</p>
              <div class="bg-slate-100 dark:bg-slate-600 p-4 rounded-lg mt-2">
                <code class="text-sm font-mono">select * from read_csv_auto("http://localhost:8080/your_file.csv");</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nice-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #94a3b8 #f1f5f9;
}

.nice-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.nice-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.nice-scrollbar::-webkit-scrollbar-thumb {
  background-color: #94a3b8;
  border-radius: 4px;
}
</style>