import type { QueryResult, SQLBackend, ExecuteArgs } from "@/types/database"
import { usePGLite } from "@/hooks/usePGLite"
import { pgToJsType } from "@/lib/utils"

export class PGLiteAdapter implements SQLBackend {
  private pglite = usePGLite()

  async execute({ query }: ExecuteArgs): Promise<QueryResult> {
    const { records, schema } = await this.pglite.query(query)
    console.log(`pglite execute`, schema)
    const cols = Object.fromEntries(schema.map((col: Record<string, unknown>) => [col.name, pgToJsType(col.dataTypeID as number)]))
    return {
      records: records,
      schema: cols,
      shouldStringify: true,
    }
  }

  async executeRaw({ query }: ExecuteArgs): Promise<unknown> {
    return this.pglite.query(query)
  }

  async connect(): Promise<void> {
    await this.pglite.ready()
  }

  async disconnect() {
    // Implement disconnection logic if needed
    return Promise.resolve()
  }
}
