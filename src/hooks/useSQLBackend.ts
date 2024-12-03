import { useProjects } from "@/store/project.ts";
import { computed } from "vue";
import { useDuckDb } from "@/hooks/useDuckDb.ts";
import { useDuckDBServer } from "@/hooks/useDuckDBServer.ts";
import { createSharedComposable } from "@vueuse/core";
import { usePGLite } from "./usePGLite";

export const useSQLBackend = createSharedComposable(() => {
	const $projects = useProjects();
	const backend = computed<any>(() => {
		switch ($projects.activeProjectMeta.sql.backend) {
			case "duckdb_server":
				return useDuckDBServer();
			case "duckdb_wasm":
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
