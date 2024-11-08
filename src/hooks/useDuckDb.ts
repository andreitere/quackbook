// useDuckDb.js
import {onMounted, Ref, ref} from "vue";
import {AsyncDuckDB, getDuckDB} from "duckdb-wasm-kit";

/**
 * Vue composable to access a singleton DuckDb instance within components or other composables.
 */
export function useDuckDb() {
  const db: Ref<AsyncDuckDB | null> = ref(null);
  const loading = ref(false);
  const error: Ref<any | null> = ref(null);

  const ready = new Promise<void>((resolve, reject) => {
    onMounted(async () => {
      try {
        if (db.value) {
          resolve();
          return;
        }
        loading.value = true;
        db.value = await getDuckDB();
        resolve(); // Resolve the promise once db is loaded
      } catch (e) {
        error.value = e;
        reject(e); // Reject the promise if there’s an error
      } finally {
        loading.value = false;
      }
    });
  });

  return {db, loading, error, ready};
}