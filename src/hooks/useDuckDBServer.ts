import { useProjects } from '@/store/project.ts';
import ky from 'ky';

export interface DuckDBServerResponse {
    result: Array<Record<string, unknown>>;
    columns: Array<{ name: string; type: string }>;
}

export function useDuckDBServer() {
    const { activeProject } = useProjects();

    const getServerHost = () => {
    // Default to localhost:8000 if no host is specified
        return activeProject.sql.host || 'http://localhost:9999';
    };

    const query = async (
        queryStr: string,
        stream = false,
    ): Promise<
    ReadableStreamDefaultReader<Uint8Array> | DuckDBServerResponse
    > => {
        const host = getServerHost();

        try {
            if (!stream) {
                const json = await ky
                    .extend({
                        timeout: 100000,
                        retry: {
                            limit: 2,
                            methods: ['post'],
                            statusCodes: [408, 429, 500, 502, 503, 504],
                        },
                    })
                    .post<DuckDBServerResponse>(`${host}/query`, {
                        json: { query: queryStr.trim(), withColumns: true },
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                    .json();
                return json;
            }

            const response = await ky
                .extend({
                    timeout: 100000,
                })
                .post(`${host}/stream`, {
                    json: { query: queryStr.trim() },
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

            const reader = response.body?.getReader();
            if (!reader) {
                throw new Error('Failed to get stream reader');
            }
            return reader;
        }
        catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === 'TimeoutError') {
                    throw new Error(
                        `Connection to DuckDB server at ${host} timed out. Please check if the server is running.`,
                    );
                }
                const response = (error as { response?: { status?: number } }).response;
                if (response?.status === 404) {
                    throw new Error(
                        `DuckDB server not found at ${host}. Please check if the server is running and the host is correct.`,
                    );
                }
                if (response?.status === 400) {
                    // @ts-ignore
                    const json = await response.json();
                    throw new Error(json.error);
                }
            }
            throw new Error(
                'An unknown error occurred while connecting to DuckDB server',
            );
        }
    };

    return { query };
}
