import type { QueryResult, SQLBackend, ExecuteArgs } from "@/types/database"
import { useDuckDb } from "@/hooks/useDuckDb"
import { isDataRetrievalQuery } from "@/lib/utils"

export class DuckDBAdapter implements SQLBackend {
  private duckdb = useDuckDb()

  private cleanQuery(query: string): string {
    return query.trim().replace(/;+$/, "")
  }

  async execute({ query }: ExecuteArgs): Promise<QueryResult> {
    const cleanedQuery = this.cleanQuery(query)

    let isRetrievalQuery = false
    try {
      isRetrievalQuery = isDataRetrievalQuery(cleanedQuery)
    } catch (error) {
      console.error(error)
    }

    const _query = isRetrievalQuery ? `WITH data AS (${cleanedQuery}) SELECT row_number() OVER () as _oid, * FROM data` : cleanedQuery

    console.log("query", _query)

    const result = await this.duckdb.query(_query)
    return {
      records: result.records,
      schema: result.schema,
      isRetrievalQuery: isRetrievalQuery,
    }
  }

  async executeRaw({ query }: ExecuteArgs): Promise<unknown> {
    return this.duckdb.query(query)
  }

  async connect(): Promise<void> {
    await this.duckdb.ready()
  }

  async disconnect() {
    // Implement disconnection logic if needed
    return Promise.resolve()
  }
}
