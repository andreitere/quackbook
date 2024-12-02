import { useProjects } from "@/store/project.ts";
import ky from "ky";

export const useDuckDBServer = () => {
	const { activeProject } = useProjects();
	const query = async (queryStr: string, stream = false) => {
		if (!stream) {
			const json = await ky
				.extend({ timeout: 100000 })
				.post<{ rows: any[]; schema: Record<string, string>[] }>(`${activeProject.sql.host}/query/stream`, { json: { query: queryStr } })
				.json();
			return { records: json, query: queryStr };
		}
		const response = await ky.post(`${activeProject.sql.host}/stream`, {
			json: { query: queryStr },
		});
		const reader = response.body?.getReader();
		console.log(reader);
		return reader;
	};
	return { query };
};
