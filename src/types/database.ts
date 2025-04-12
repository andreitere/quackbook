export type SQLBackendType = "duckdb_server" | "duckdb_wasm" | "pglite_wasm"

export interface QueryResult {
  records: unknown[] | ReadableStreamDefaultReader<Uint8Array>
  schema: Record<string, string>
  duration?: number
  streamed?: boolean
  shouldStringify?: boolean
}

export interface SQLBackend {
  execute: (query: string, stream?: boolean) => Promise<QueryResult>
  // Add other common methods that all backends should implement
  connect: () => Promise<void>
  disconnect: () => Promise<void>
}

export interface BackendConfig {
  type: SQLBackendType
  name: string
  factory: () => SQLBackend
}
