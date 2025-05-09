import { arrowTypeToJsType } from "@/lib/utils.ts"
import type { DuckDBConfig } from "@duckdb/duckdb-wasm"
import type { Field } from "apache-arrow"
import { type AsyncDuckDB, initializeDuckDb } from "duckdb-wasm-kit"
// useDuckDb.js
import { type Ref, ref } from "vue"

const db = ref<AsyncDuckDB>()
const loading = ref(false)

// Patch BigInt's toString method
;(BigInt.prototype as any).toJSON = function () {
  return this.toString()
}

interface UseDuckDbReturn {
  db: Ref<AsyncDuckDB | undefined>
  loading: Ref<boolean>
  error: Ref<unknown | null>
  ready: () => Promise<boolean>
  query: (queryStr: string, raw?: boolean) => Promise<QueryResult>
}

interface QueryResult {
  schema: Record<string, string>
  records: any[]
  query: string
  duration: number
}

export function useDuckDb(config?: DuckDBConfig): UseDuckDbReturn {
  const error: Ref<unknown | null> = ref(null)
  const _config = {
    query: {
      castDecimalToDouble: true,
      castBigIntToDouble: true,
    },
    ...(config || {}),
  }
  const ready = async () => {
    try {
      if (db.value) {
        return true
      }
      loading.value = true
      db.value = (await initializeDuckDb({
        config: _config,
      })) as AsyncDuckDB
      return true
    } catch (e) {
      error.value = e
      throw e
    } finally {
      loading.value = false
    }
  }

  const query = async (queryStr: string): Promise<QueryResult> => {
    const start = performance.now()
    await ready()
    if (!db.value) {
      throw "un initialized db"
    }
    const conn = await db.value.connect()
    const results = await conn.query(queryStr)
    const duration = performance.now() - start

    const schema = results.schema.fields.reduce((acc: Record<string, string>, next: Field) => {
      acc[next?.name as string] = arrowTypeToJsType(next.type)
      return acc
    }, {})

    const records = results.toArray()
    await conn.close()

    return { schema, records, query: queryStr, duration }
  }

  return { db, loading, error, ready, query }
}
