import { QueryResult, SQLBackend } from "@/types/database";
import { usePGLite } from "@/hooks/usePGLite";

export class PGLiteAdapter implements SQLBackend {
  private pglite = usePGLite();

  async execute(query: string, stream = false): Promise<QueryResult> {
    const result = await this.pglite.query(query);
    return {
      records: result.records,
      schema: result.schema,
      duration: result.duration
    };
  }

  async connect(): Promise<void> {
    await this.pglite.ready();
  }

  async disconnect() {
    // Implement disconnection logic if needed
    return Promise.resolve();
  }
} 