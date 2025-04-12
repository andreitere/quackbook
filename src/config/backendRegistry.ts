import type { BackendConfig, SQLBackendType } from '@/types/database';
import { DuckDBAdapter } from '@/adapters/duckDBAdapter';
import { DuckDBServerAdapter } from '@/adapters/duckDBServerAdapter';
import { PGLiteAdapter } from '@/adapters/pgliteAdapter';

export const backendRegistry: Record<SQLBackendType, BackendConfig> = {
    duckdb_server: {
        type: 'duckdb_server',
        name: 'DuckDB Server',
        factory: () => new DuckDBServerAdapter(),
    },
    duckdb_wasm: {
        type: 'duckdb_wasm',
        name: 'DuckDB WASM',
        factory: () => new DuckDBAdapter(),
    },
    pglite_wasm: {
        type: 'pglite_wasm',
        name: 'PGLite WASM',
        factory: () => new PGLiteAdapter(),
    },
};
