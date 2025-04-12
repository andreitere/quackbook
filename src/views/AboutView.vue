<script setup lang="ts">
</script>

<template>
  <div
    class="page flex flex-col container mx-auto my-10 prose prose-slate dark:prose-invert overflow-y-scroll nice-scrollbar max-w-4xl"
  >
    <div class="h-0 flex-grow space-y-12">
      <section class="hero-section">
        <h1 class="text-3xl font-bold mb-4">
          Welcome to QuackBook
        </h1>
        <p class="text-lg text-gray-500 dark:text-gray-400">
          An interactive SQL notebook powered by DuckDB WASM, enabling you to run SQL queries, analyze data,
          and explore insights directly in your browser - no backend required.
        </p>
      </section>

      <section class="features-section">
        <h2 class="text-xl font-semibold mb-4">
          Key Features
        </h2>
        <ul class="space-y-3">
          <li class="flex items-center gap-2">
            <i class="i-mdi:code-braces text-gray-400 dark:text-gray-500" />
            <span class="text-gray-600 dark:text-gray-300">Interactive SQL execution in the browser</span>
          </li>
          <li class="flex items-center gap-2">
            <i class="i-mdi:markdown text-gray-400 dark:text-gray-500" />
            <span class="text-gray-600 dark:text-gray-300">Rich markdown support for documentation</span>
          </li>
          <li class="flex items-center gap-2">
            <i class="i-mdi:database text-gray-400 dark:text-gray-500" />
            <span class="text-gray-600 dark:text-gray-300">Import and attach external databases</span>
          </li>
          <li class="flex items-center gap-2">
            <i class="i-mdi:keyboard text-gray-400 dark:text-gray-500" />
            <span class="text-gray-600 dark:text-gray-300">Keyboard shortcuts for quick navigation</span>
          </li>
          <li class="flex items-center gap-2">
            <i class="i-akar-icons:postgresql-fill text-gray-400 dark:text-gray-500" />
            <span class="text-gray-600 dark:text-gray-300">PGlite WASM support for PostgreSQL compatibility</span>
          </li>
          <li class="flex items-center gap-2">
            <i class="i-mdi:server-network text-gray-400 dark:text-gray-500" />
            <span class="text-gray-600 dark:text-gray-300">Connect to local DuckDB server for enhanced
              performance</span>
          </li>
        </ul>
      </section>

      <section class="motivation-section">
        <h2 class="text-xl font-semibold mb-4">
          Why QuackBook?
        </h2>
        <p class="text-gray-500 dark:text-gray-400">
          As someone who works with data daily, I found myself constantly switching between SQL and Python. While pandas
          is powerful,
          SQL's declarative nature and simplicity always felt more natural to me. QuackBook was born from this
          preference and a desire
          to create a tool that makes SQL exploration more accessible and enjoyable.
        </p>
      </section>

      <section class="tutorial-section">
        <h2 class="text-xl font-semibold mb-4">
          Learn by Example
        </h2>
        <p class="mb-4 text-gray-500 dark:text-gray-400">
          Check out our interactive tutorial on <a
            href="/import/eyJpZCI6bnVsbCwibmFtZSI6IltTUUxdIExlYXJuaW5nIGFib3V0IGxlZnQgam9pbiIsImNlbGxzIjpbeyJpZCI6MTczMTE3MzA3OTc2MiwidHlwZSI6Im1hcmtkb3duIiwicG9zaXRpb24iOjEsInF1ZXJ5IjoiIyIsIm1hcmtkb3duIjoiIyBBYm91dCBTUUwgTEVGVCBKT0lOXG5cbkEgKipMRUZUIEpPSU4qKiBpbiBTUUwgaXMgYSB0eXBlIG9mIGpvaW4gdGhhdCByZXR1cm5zIGFsbCByZWNvcmRzIGZyb20gdGhlIFwibGVmdFwiIChvciBmaXJzdCkgdGFibGUsIGFsb25nIHdpdGggbWF0Y2hlZCByZWNvcmRzIGZyb20gdGhlIFwicmlnaHRcIiAoc2Vjb25kKSB0YWJsZS4gSWYgdGhlcmUncyBubyBtYXRjaCwgdGhlIHJlc3VsdCBpcyBgTlVMTGAgZm9yIGNvbHVtbnMgZnJvbSB0aGUgcmlnaHQgdGFibGUuIEl04oCZcyBoZWxwZnVsIHdoZW4geW91IG5lZWQgZGF0YSBmcm9tIG9uZSB0YWJsZSBidXQgYWxzbyB3YW50IGFueSBhdmFpbGFibGUsIG1hdGNoaW5nIGluZm9ybWF0aW9uIGZyb20gYW5vdGhlci5cbmFzYXNkZiBhc2RcbiMjIyBCYXNpYyBTeW50YXhcblxuYGBgc3FsXG5zZWxlY3QgY29sdW1uc1xuZnJvbSB0YWJsZTFcbmxlZnQgam9pbiB0YWJsZTJcbm9uIHRhYmxlMS5jb2x1bW4gPSB0YWJsZTIuY29sdW1uO1xuYGBgXG5cblJ1biBiZWxvdyBleGFtcGxlcyBhbmQgY2hlY2sgaXQgeW91cnNlbGYuIn0seyJpZCI6MTczMTE3OTE5ODc3MywidHlwZSI6Im1hcmtkb3duIiwicG9zaXRpb24iOjIsInF1ZXJ5IjoiIiwibWFya2Rvd24iOiJfXzEuIGxvYWQgdGhlIGRhdGFfXyJ9LHsiaWQiOjE3MzExNjg3ODA1MDMsInF1ZXJ5IjoiQVRUQUNIICdodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vdG9iaWxnL2F3cy1pYW0tZGF0YS9tYWluL2RhdGEvZGIvaWFtLmR1Y2tkYicgYXMgYXdzX2lhbSAoUkVBRF9PTkxZKTsiLCJ0eXBlIjoic3FsIiwicG9zaXRpb24iOjN9LHsiaWQiOjE3MzExNzkyODAyMzYsInR5cGUiOiJtYXJrZG93biIsInBvc2l0aW9uOjQsInF1ZXJ5IjoiIiwibWFya2Rvd24iOiJfXzIuIGNoZWNrIGFjdGlvbnMgdGFibGVfXyJ9LHsiaWQiOjE3MzExNjg4MDEzMzQsInR5cGUiOiJzcWwiLCJwb3NpdGlvbiI6NSwicXVlcnkiOiJzZWxlY3QgKiBmcm9tIGF3c19pYW0uYWN0aW9uczsiLCJtYXJrZG93biI6IiJ9LHsiaWQiOjE3MzExNzkzMDk0NzMsInR5cGUiOiJtYXJrZG93biIsInBvc2l0aW9uOjYsInF1ZXJ5IjoiIiwibWFya2Rvd24iOiJfXzMuIGNoZWNrIHNlcnZpY2VzIHRhYmxlX18ifSx7ImlkIjoxNzMxMTc5MzQxNzM4LCJ0eXBlIjoic3FsIiwicG9zaXRpb24iOjcsInF1ZXJ5Ijoic2VsZWN0ICogZnJvbSBhd3NfaWFtLnNlcnZpY2VzOyIsIm1hcmtkb3duIjoiIn0seyJpZCI6MTczMTE3OTM2NjQ2MCwidHlwZSI6Im1hcmtkb3duIiwicG9zaXRpb24iOjgsInF1ZXJ5IjoiIiwibWFya2Rvd24iOiJfXzQuIGpvaW4gdGhlIGRhdGFfX1xuXG5Mb29rIGhvdyBlYWNoIGVudHJ5IGluIHNlcnZpY2VzIHRhYmxlIGlzIGxpbmtlZCB0byBlYWNoIGVudHJ5IGluIHRoZSBhY3Rpb25zIHRhYmxlIn0seyJpZCI6MTczMTE3OTQxMzc2MiwidHlwZSI6InNxbCIsInBvc2l0aW9uOjksInF1ZXJ5Ijoic2VsZWN0IHNlcnYubmFtZSBhcyBzZXJ2aWNlX25hbWUsIGFjdGkubmFtZSBhcyBhY3Rpb25fbmFtZSwgYWN0aS5hY2Nlc3NfbGV2ZWwgYXMgYWNjZXNzX2xldmVsXG5mcm9tIGF3c19pYW0uc2VydmljZXMgc2VydlxubGVmdCBqb2luIGF3c19pYW0uYWN0aW9ucyBhY3RpXG5vbiBzZXJ2LnNlcnZpY2VfaWQgPSBhY3RpLnNlcnZpY2VfaWQiLCJtYXJrZG93biI6IiJ9XSwibW9kZSI6Im5vdGVib29rIiwiZGlydHkiOnRydWV9"
            class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
          >SQL LEFT JOINs</a> to
          see how QuackBook combines SQL and markdown for an interactive learning experience.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <h3 class="font-medium mb-2 text-gray-700 dark:text-gray-300">
              Quick Commands
            </h3>
            <p class="text-gray-500 dark:text-gray-400">
              Press <span class="cmd-btn">CMD/CTRL + K</span> to explore
              available commands
            </p>
          </div>
          <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <h3 class="font-medium mb-2 text-gray-700 dark:text-gray-300">
              Schema Explorer
            </h3>
            <p class="text-gray-500 dark:text-gray-400">
              Use <span class="cmd-btn">CMD/CTRL + SHIFT + E</span> to inspect
              database schemas
            </p>
          </div>
        </div>
      </section>

      <div class="note-section p-4 rounded-lg bg-yellow-50/50 dark:bg-yellow-900/10">
        <p class="text-yellow-700 dark:text-yellow-300">
          <i class="i-mdi:information inline-block mr-2" />
          QuackBook is currently under active development. We're working hard to bring you new features and
          improvements!
        </p>
      </div>

      <section class="author-section">
        <h2 class="text-xl font-semibold mb-4">
          About the Creator
        </h2>
        <div class="flex items-center gap-4 mb-4 space-y-4">
          <div
            class="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden"
          >
            <img
              src="https://avatars.githubusercontent.com/u/3197966?v=4"
              alt=""
            >
          </div>
          <div class="flex flex-col space-y-2">
            <span class="text-lg font-medium text-gray-700 dark:text-gray-300">Hi, I'm Andrei (tere)</span>
            <span class="text-gray-500 dark:text-gray-400">Software Engineer</span>
          </div>
        </div>
        <div class="flex gap-4">
          <a
            href="https://tere.ro"
            target="_blank"
            class="social-link"
          >
            <i class="i-mdi:web text-xl" />
            <span>tere.ro</span>
          </a>
          <a
            href="https://bsky.app/profile/tere.ro"
            target="_blank"
            class="social-link"
          >
            <i class="i-mdi:bird text-xl" />
            <span>@tere.ro</span>
          </a>
          <a
            href="https://x.com/andreiterecoasa"
            target="_blank"
            class="social-link"
          >
            <i class="i-mdi:twitter text-xl" />
            <span>@andreiterecoasa</span>
          </a>
          <a
            href="https://github.com/andreitere"
            target="_blank"
            class="social-link"
          >
            <i class="i-mdi:github text-xl" />
            <span>andreitere</span>
          </a>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.cmd-btn {
  @apply bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-gray-600 dark:text-gray-300;
}

.social-link {
  @apply flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors;
}

.prose {
  @apply max-w-none;
}

.prose h1 {
  @apply text-2xl md:text-3xl;
}

.prose h2 {
  @apply text-xl md:text-2xl;
}

.prose p {
  @apply text-gray-500 dark:text-gray-400;
}

.prose a {
  @apply text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100;
}
</style>