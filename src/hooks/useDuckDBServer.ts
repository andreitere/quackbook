import { useProjects } from "@/store/project.ts";
import ky from "ky";

interface DuckDBQueryResult {
  rows: any[];
  schema: Array<{ name: string; type: string }>;
}

interface DuckDBResponse {
  records: DuckDBQueryResult;
  query: string;
}

export const useDuckDBServer = () => {
  const { activeProject } = useProjects();

  const getServerHost = () => {
    // Default to localhost:8000 if no host is specified
    return activeProject.sql.host || "http://localhost:9999";
  };

  const query = async (
    queryStr: string,
    stream = false
  ): Promise<ReadableStreamDefaultReader<Uint8Array> | DuckDBResponse> => {
    const host = getServerHost();

    try {
      if (!stream) {
        const json = await ky
          .extend({
            timeout: 100000,
            retry: {
              limit: 2,
              methods: ["post"],
              statusCodes: [408, 429, 500, 502, 503, 504],
            },
          })
          .post<DuckDBResponse>(`${host}/query`, {
            json: { query: queryStr.trim() },
            headers: {
              "Content-Type": "application/json",
            },
          })
          .json();
        return json;
      }

      const response = await ky.post(`${host}/query`, {
        json: { query: queryStr.trim() },
        headers: {
          "Content-Type": "application/json",
        },
      });

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Failed to get stream reader");
      }

      return reader;
    } catch (error: any) {
      if (error.name === "TimeoutError") {
        throw new Error(
          `Connection to DuckDB server at ${host} timed out. Please check if the server is running.`
        );
      }
      if (error.response?.status === 404) {
        throw new Error(
          `DuckDB server not found at ${host}. Please check if the server is running and the host is correct.`
        );
      }
      throw new Error(`Failed to connect to DuckDB server: ${error.message}`);
    }
  };

  return { query };
};
