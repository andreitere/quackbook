import type { QueryResult, SQLBackend } from "@/types/database";
import { useDuckDb } from "@/hooks/useDuckDb";

export class DuckDBAdapter implements SQLBackend {
  private duckdb = useDuckDb();

  async execute(query: string, stream = false): Promise<QueryResult> {
    const result = await this.duckdb.query(query);
    return {
      records: result.records,
      schema: result.schema,
      duration: result.duration
    };
  }

  async connect(): Promise<void> {
    await this.duckdb.ready();
  }

  async disconnect() {
    // Implement disconnection logic if needed
    return Promise.resolve();
  }
} 