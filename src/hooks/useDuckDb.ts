import type {DuckDBConfig} from "@duckdb/duckdb-wasm";
import {type AsyncDuckDB, initializeDuckDb} from "duckdb-wasm-kit";
// useDuckDb.js
import {type Ref, ref} from "vue";
import type {Field} from "apache-arrow";
import {arrowTypeToJsType} from "@/lib/utils.ts";

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
      console.log({_config})
      db.value = (await initializeDuckDb({config: _config})) as AsyncDuckDB;
      return true;
    } catch (e) {
      error.value = e;
      throw e;
    } finally {
      loading.value = false;
    }
  }

  const query = async (queryStr: string, raw = false) => {
    await ready();
    if (!db.value) {
      throw 'un initialized db'
    }
    if(raw) {
      console.log('wants raw')
    }
    const conn = await db.value.connect();
    const results = await conn.query(queryStr)
    if (!results) {
      return console.warn("no results");
    }
    //@ts-ignore{3}
    const schema = results.schema.fields.reduce(
        (acc: Record<string, string>, next: Field) => {
          acc[next?.name as string] = arrowTypeToJsType(next.type);
          return acc;
        },
        {},
    );
    // const records = JSON.parse(
    //     JSON.stringify(
    //         results.toArray(),
    //         (_, value) => (typeof value === "bigint" ? value.toString() : value), // return everything else unchanged
    //     ),
    // );
    const records = results.toArray();
    await conn.close()

    return {schema, records, query: queryStr};
  }

  return {db, loading, error, ready, query};
}
