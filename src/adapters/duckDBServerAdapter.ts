import type { QueryResult, SQLBackend } from "@/types/database";
import { useDuckDBServer } from "@/hooks/useDuckDBServer";

export class DuckDBServerAdapter implements SQLBackend {
  private duckdbServer = useDuckDBServer();

  async execute(query: string, stream = false): Promise<QueryResult | ReadableStreamDefaultReader<Uint8Array>> {
    if (stream) {
      const result = await this.duckdbServer.query(query, true);
      if (!(result instanceof ReadableStreamDefaultReader)) {
        throw new Error("Expected stream reader for streaming query");
      }
      return result;
    }
    
    const result = await this.duckdbServer.query(query, false);
    if (result instanceof ReadableStreamDefaultReader) {
      throw new Error("Unexpected stream reader for non-streaming query");
    }

    return {
      records: result.records.rows,
      schema: result.records.schema.reduce((acc: Record<string, string>, field) => {
        acc[field.name] = field.type;
        return acc;
      }, {}),
      duration: 0
    };
  }

  async connect(): Promise<void> {
    // Connection is handled per-query
    return Promise.resolve();
  }

  async disconnect(): Promise<void> {
    // Disconnection is handled per-query
    return Promise.resolve();
  }
} 