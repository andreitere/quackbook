import type { QueryResult, SQLBackend } from "@/types/database"
import { useDuckDBServer } from "@/hooks/useDuckDBServer"
import { isDataRetrievalQuery, duckToJsType } from "@/lib/utils"
export class DuckDBServerAdapter implements SQLBackend {
  private duckdbServer = useDuckDBServer()

  async execute(query: string, stream = false): Promise<QueryResult | ReadableStreamDefaultReader<Uint8Array>> {
    let isRetrievalQuery = false
    try {
      isRetrievalQuery = isDataRetrievalQuery(query)
    } catch (error) {
      console.error(error)
    }
    let cols = []
    if (isRetrievalQuery) {
      console.log("isRetrievalQuery", isRetrievalQuery)
      const colsQuery = `DESCRIBE \n ${query}`
      const colsResult = await this.duckdbServer.query(colsQuery, false)
      cols = colsResult.result.reduce((acc: Record<string, string>, col) => {
        acc[col.column_name] = duckToJsType(col.column_type)
        return acc
      }, {})
    }

    const data = await this.duckdbServer.query(query, stream)

    return {
      records: data,
      schema: cols,
      streamed: stream,
    }
  }

  async connect(): Promise<void> {
    // Connection is handled per-query
    return Promise.resolve()
  }

  async disconnect(): Promise<void> {
    // Disconnection is handled per-query
    return Promise.resolve()
  }
}
