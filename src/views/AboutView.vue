<script setup lang="ts">

</script>

<template>
  <div class="page flex flex-col container mx-auto my-10 prose prose-slate dark:prose-invert overflow-y-scroll nice-scrollbar ">
    <div class="h-0 flex-grow ">
      <h1>What is QuackBook?</h1>
      <p>
        QuackBook is an interactive SQL notebook powered by DuckDB WASM, enabling users to run SQL queries, analyze data,
        and
        explore insights directly in the browser without the need for a backend.
      </p>


      <h2>Motivation</h2>

      <p>Honestly? Because DuckDB changed the way I work with data. Though I'm not a data scientist, my day-to-day work involves a lot of data manipulation, often through pandas in
        Jupyter notebooks.</p>

      <p>But I’m an SQL enthusiast at heart, and while pandas has its place, SQL just feels like home. This project stems from that preference, along with a healthy dose of
        curiosity and a desire to deepen my understanding. Sure, there are other similar tools out there, some even free. But I wanted to build my own as part of my learning
        journey.</p>

      <h2>What can you do with QuackBook?</h2>
      <p>Pretty much whatever you can imagine combining SQL and markdown!</p>

      <p>QuackBook isn’t just for running SQL in the browser—it’s also a learning tool.</p>
      <p>For instance, you can find a quick (yet, unpolished) tutorial on left joins <a href="/import/eyJpZCI6bnVsbCwibmFtZSI6IltTUUxdIExlYXJuaW5nIGFib3V0IGxlZnQgam9pbiIsImNlbGxzIjpbeyJpZCI6MTczMTE3MzA3OTc2MiwidHlwZSI6Im1hcmtkb3duIiwicG9zaXRpb24iOjEsInF1ZXJ5IjoiIyIsIm1hcmtkb3duIjoiIyBBYm91dCBTUUwgTEVGVCBKT0lOXG5cbkEgKipMRUZUIEpPSU4qKiBpbiBTUUwgaXMgYSB0eXBlIG9mIGpvaW4gdGhhdCByZXR1cm5zIGFsbCByZWNvcmRzIGZyb20gdGhlIFwibGVmdFwiIChvciBmaXJzdCkgdGFibGUsIGFsb25nIHdpdGggbWF0Y2hlZCByZWNvcmRzIGZyb20gdGhlIFwicmlnaHRcIiAoc2Vjb25kKSB0YWJsZS4gSWYgdGhlcmUncyBubyBtYXRjaCwgdGhlIHJlc3VsdCBpcyBgTlVMTGAgZm9yIGNvbHVtbnMgZnJvbSB0aGUgcmlnaHQgdGFibGUuIEl04oCZcyBoZWxwZnVsIHdoZW4geW91IG5lZWQgZGF0YSBmcm9tIG9uZSB0YWJsZSBidXQgYWxzbyB3YW50IGFueSBhdmFpbGFibGUsIG1hdGNoaW5nIGluZm9ybWF0aW9uIGZyb20gYW5vdGhlci5cbmFzYXNkZiBhc2RcbiMjIyBCYXNpYyBTeW50YXhcblxuYGBgc3FsXG5zZWxlY3QgY29sdW1uc1xuZnJvbSB0YWJsZTFcbmxlZnQgam9pbiB0YWJsZTJcbm9uIHRhYmxlMS5jb2x1bW4gPSB0YWJsZTIuY29sdW1uO1xuYGBgXG5cblJ1biBiZWxvdyBleGFtcGxlcyBhbmQgY2hlY2sgaXQgeW91cnNlbGYuIn0seyJpZCI6MTczMTE3OTE5ODc3MywidHlwZSI6Im1hcmtkb3duIiwicG9zaXRpb24iOjIsInF1ZXJ5IjoiIiwibWFya2Rvd24iOiJfXzEuIGxvYWQgdGhlIGRhdGFfXyJ9LHsiaWQiOjE3MzExNjg3ODA1MDMsInF1ZXJ5IjoiQVRUQUNIICdodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vdG9iaWxnL2F3cy1pYW0tZGF0YS9tYWluL2RhdGEvZGIvaWFtLmR1Y2tkYicgYXMgYXdzX2lhbSAoUkVBRF9PTkxZKTsiLCJ0eXBlIjoic3FsIiwicG9zaXRpb24iOjN9LHsiaWQiOjE3MzExNzkyODAyMzYsInR5cGUiOiJtYXJrZG93biIsInBvc2l0aW9uIjo0LCJxdWVyeSI6IiIsIm1hcmtkb3duIjoiX18yLiBjaGVjayBhY3Rpb25zIHRhYmxlX18ifSx7ImlkIjoxNzMxMTY4ODAxMzM0LCJ0eXBlIjoic3FsIiwicG9zaXRpb24iOjUsInF1ZXJ5Ijoic2VsZWN0ICogZnJvbSBhd3NfaWFtLmFjdGlvbnM7IiwibWFya2Rvd24iOiIifSx7ImlkIjoxNzMxMTc5MzA5NDczLCJ0eXBlIjoibWFya2Rvd24iLCJwb3NpdGlvbiI6NiwicXVlcnkiOiIiLCJtYXJrZG93biI6Il9fMy4gY2hlY2sgc2VydmljZXMgdGFibGVfXyJ9LHsiaWQiOjE3MzExNzkzNDE3MzgsInR5cGUiOiJzcWwiLCJwb3NpdGlvbiI6NywicXVlcnkiOiJzZWxlY3QgKiBmcm9tIGF3c19pYW0uc2VydmljZXM7IiwibWFya2Rvd24iOiIifSx7ImlkIjoxNzMxMTc5MzY2NDYwLCJ0eXBlIjoibWFya2Rvd24iLCJwb3NpdGlvbiI6OCwicXVlcnkiOiIiLCJtYXJrZG93biI6Il9fNC4gam9pbiB0aGUgZGF0YV9fXG5cbkxvb2sgaG93IGVhY2ggZW50cnkgaW4gc2VydmljZXMgdGFibGUgaXMgbGlua2VkIHRvIGVhY2ggZW50cnkgaW4gdGhlIGFjdGlvbnMgdGFibGUifSx7ImlkIjoxNzMxMTc5NDEzNzYyLCJ0eXBlIjoic3FsIiwicG9zaXRpb24iOjksInF1ZXJ5Ijoic2VsZWN0IHNlcnYubmFtZSBhcyBzZXJ2aWNlX25hbWUsIGFjdGkubmFtZSBhcyBhY3Rpb25fbmFtZSwgYWN0aS5hY2Nlc3NfbGV2ZWwgYXMgYWNjZXNzX2xldmVsXG5mcm9tIGF3c19pYW0uc2VydmljZXMgc2VydlxubGVmdCBqb2luIGF3c19pYW0uYWN0aW9ucyBhY3RpXG5vbiBzZXJ2LnNlcnZpY2VfaWQgPSBhY3RpLnNlcnZpY2VfaWQiLCJtYXJrZG93biI6IiJ9XSwibW9kZSI6Im5vdGVib29rIiwiZGlydHkiOnRydWV9">here</a>.
        The interface offers two types of cells: markdown and SQL, so feel free to combine
        explanations with code.</p>

      <p>To explore available commands, just press <span class="bg-amber-600 text-white p-1">CMD/CTRL + K.</span></p>

      <p>And if you import or create tables or attach other databases, you can even inspect schemas with <span class="bg-amber-600 text-white p-1">CMD/CTRL + SHIFT + E.</span></p>

      <div class="bg-gray-700 p-5 text-white">
        Bear in mind that this is under active development at the moment. Expect the worst. Hope for the best.
        😅.
      </div>
      <h2>About the author</h2>

      <p>Hi. I'm Andrei. Friends call me tere.. like my website: <a href="https://tere.ro" target="_blank">tere.ro 🧑‍💻</a>.
      </p>
      <p class="align-center">Follow me on <i class="i-logos:bluesky inline-block"></i> <a
          href="https://bsky.app/profile/tere.ro" target="_blank">@tere.ro</a>
        or on <i class="inline-block i-line-md:twitter-x"></i>
        <a href="https://x.com/andreiterecoasa" target="_blank">@andreiterecoasa</a> or <i
            class="i-line-md:github-twotone inline-block"></i> <a
            href="https://github.com/andreitere" target="_blank">andreitere</a></p>

    </div>
  </div>
</template>

<style scoped>

</style>