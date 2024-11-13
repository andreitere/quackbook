import type { DuckDBConfig } from "@duckdb/duckdb-wasm";
import { type AsyncDuckDB, initializeDuckDb } from "duckdb-wasm-kit";
// useDuckDb.js
import { type Ref, onMounted, ref } from "vue";

const db = ref<AsyncDuckDB>();

export function useDuckDb(config?: DuckDBConfig) {
	const loading = ref(false);
	const error: Ref<unknown | null> = ref(null);
	const _config = {
		query: {
			// castDecimalToDouble: true,
			// castBigIntToDouble: true,
		},
		...(config || {}),
	};
	const ready = new Promise<void>((resolve, reject) => {
		onMounted(async () => {
			try {
				if (db.value) {
					resolve();
					return;
				}
				loading.value = true;
				db.value = (await initializeDuckDb({ config: _config })) as AsyncDuckDB;
				resolve(); // Resolve the promise once db is loaded
			} catch (e) {
				error.value = e;
				reject(e); // Reject the promise if there’s an error
			} finally {
				loading.value = false;
			}
		});
	});

	return { db, loading, error, ready };
}
