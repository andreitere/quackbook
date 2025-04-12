import type { QueryResult, SQLBackend } from "@/types/database";
import { usePGLite } from "@/hooks/usePGLite";

export class PGLiteAdapter implements SQLBackend {
  private pglite = usePGLite();

  async execute(...args: unknown[]): Promise<QueryResult> {
    const [query] = args
    const result = await this.pglite.query(query as string);
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