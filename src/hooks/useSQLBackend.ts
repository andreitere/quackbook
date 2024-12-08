import { useProjects } from "@/store/project.ts";
import { computed } from "vue";
import { useDuckDb } from "@/hooks/useDuckDb.ts";
import { useDuckDBServer } from "@/hooks/useDuckDBServer.ts";
import { usePGLite } from "./usePGLite";
import { createGlobalState } from "@vueuse/core";

export const useSQLBackend = createGlobalState(() => {
	const $projects = useProjects();
	const backend = computed<any>(() => {
		switch ($projects.activeProjectMeta.sql.backend) {
			case "duckdb_server":
				console.log("using duckdb server");
				return useDuckDBServer();
			case "duckdb_wasm":
				console.log("using duckdb wasm");
				return useDuckDb();
			case "pglite_wasm":
				console.log("using pglite");
				return usePGLite();
			default:
				return useDuckDb();
		}
	});
	return { backend };
});
