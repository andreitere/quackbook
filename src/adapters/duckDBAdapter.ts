import type { QueryResult, SQLBackend } from "@/types/database";
import { useDuckDb } from "@/hooks/useDuckDb";
import { isDataRetrievalQuery } from "@/lib/utils";

export class DuckDBAdapter implements SQLBackend {
  private duckdb = useDuckDb();

  private cleanQuery(query: string): string {
    return query.trim().replace(/;+$/, '');
  }

  async execute(query: string, stream = false): Promise<QueryResult> {
    const cleanedQuery = this.cleanQuery(query);
    
    let isRetrievalQuery = false;
    try {
      isRetrievalQuery = isDataRetrievalQuery(cleanedQuery);
    } catch (error) {
      console.error(error);
    }
   
    const _query = isRetrievalQuery 
      ? `WITH data AS (${cleanedQuery}) SELECT row_number() OVER () as _oid, * FROM data`
      : cleanedQuery;

    console.log("query", _query);

    const result = await this.duckdb.query(_query);
    return {
      records: result.records,
      schema: result.schema,
      duration: result.duration,
      streamed: stream
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