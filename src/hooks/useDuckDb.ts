// useDuckDb.js
import {onMounted, Ref, ref} from "vue";
import {AsyncDuckDB, getDuckDB} from "duckdb-wasm-kit";

/**
 * Vue composable to access a singleton DuckDb instance within components or other composables.
 */
export function useDuckDb() {
  const db: Ref<AsyncDuckDB | null> = ref(null);
  const loading = ref(true);
  const error: Ref<any | null> = ref(null);

  onMounted(async () => {
    try {
      db.value = await getDuckDB();
    } catch (e) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  });

  return {db, loading, error};
}