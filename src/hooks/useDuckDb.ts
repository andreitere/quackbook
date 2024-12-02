import { arrowTypeToJsType } from "@/lib/utils.ts";
import type { DuckDBConfig } from "@duckdb/duckdb-wasm";
import type { Field } from "apache-arrow";
import { type AsyncDuckDB, initializeDuckDb } from "duckdb-wasm-kit";
// useDuckDb.js
import { type Ref, ref } from "vue";

const db = ref<AsyncDuckDB>();
const loading = ref(false);

// Patch BigInt's toString method
(BigInt.prototype as any).toJSON = function () {
	return this.toString();
};

export function useDuckDb(config?: DuckDBConfig) {
	const error: Ref<unknown | null> = ref(null);
	const _config = {
		query: {
			castDecimalToDouble: true,
			castBigIntToDouble: true,
		},
		...(config || {}),
	};
	const ready = async () => {
		try {
			if (db.value) {
				return true;
			}
			loading.value = true;
			db.value = (await initializeDuckDb({
				config: _config,
			})) as AsyncDuckDB;
			return true;
		} catch (e) {
			error.value = e;
			throw e;
		} finally {
			loading.value = false;
		}
	};

	const query = async (queryStr: string, raw = false) => {
		const start = performance.now();
		await ready();
		if (!db.value) {
			throw "un initialized db";
		}
		if (raw) {
			console.log("wants raw");
		}
		const conn = await db.value.connect();
		const results = await conn.query(queryStr);
		const duration = performance.now() - start;
		if (!results) {
			return console.warn("no results");
		}
		//@ts-ignore
		const schema = results.schema.fields.reduce((acc: Record<string, string>, next: Field) => {
			acc[next?.name as string] = arrowTypeToJsType(next.type);
			return acc;
		}, {});
		const records = results.toArray();
		await conn.close();

		return { schema, records, query: queryStr, duration };
	};

	return { db, loading, error, ready, query };
}
