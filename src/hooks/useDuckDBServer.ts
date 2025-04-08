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
	
	const query = async (queryStr: string, stream = false): Promise<ReadableStreamDefaultReader<Uint8Array> | DuckDBResponse> => {
		if (!stream) {
			const json = await ky
				.extend({ timeout: 100000 })
				.post<DuckDBResponse>(`${activeProject.sql.host}/query/stream`, { json: { query: queryStr } })
				.json();
			return json;
		}
		const response = await ky.post(`${activeProject.sql.host}/stream`, {
			json: { query: queryStr },
		});
		const reader = response.body?.getReader();
		if (!reader) {
			throw new Error("Failed to get stream reader");
		}
		return reader;
	};
	
	return { query };
};
