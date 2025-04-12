import type { ExecuteArgs, QueryResult, SQLBackend } from "@/types/database"
import { DuckDBServerResponse, useDuckDBServer } from "@/hooks/useDuckDBServer"
import { isDataRetrievalQuery, duckToJsType } from "@/lib/utils"

export class DuckDBServerAdapter implements SQLBackend {
  private duckdbServer = useDuckDBServer()

  async execute({ query, withColumns = true }: ExecuteArgs): Promise<QueryResult> {
    console.log("execute", query, withColumns)
    let isRetrievalQuery = false
    try {
      isRetrievalQuery = isDataRetrievalQuery(query)
    } catch (error) {
      console.error(error)
    }
    let cols: Record<string, string> = {}
    if (isRetrievalQuery && withColumns) {
      console.log("isRetrievalQuery", isRetrievalQuery)
      const colsQuery = `DESCRIBE \n ${query}`
      const colsResult = (await this.duckdbServer.query(colsQuery, false)) as DuckDBServerResponse
      cols = colsResult.result.reduce((acc: Record<string, string>, col) => {
        //@ts-ignore
        acc[col.column_name] = duckToJsType(col.column_type)
        return acc
      }, {})
    }

    const data = (await this.duckdbServer.query(query as string, true)) as ReadableStreamDefaultReader<Uint8Array>

    return {
      records: data,
      schema: cols,
      streamed: true,
      shouldStringify: false,
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
