import { useProjects } from "@/store/project.ts";
import { computed } from "vue";
import { useDuckDb } from "@/hooks/useDuckDb.ts";
import { useDuckDBServer } from "@/hooks/useDuckDBServer.ts";
import { createSharedComposable } from "@vueuse/core";

export const useSQLBackend = createSharedComposable(() => {
  const { activeProject } = useProjects();
  const backend = computed<any>(() => {
    switch (activeProject.sql.backend) {
      case "duckdb_server":
        return useDuckDBServer();
      case "duckdb_wasm":
        return useDuckDb();
      default:
        return useDuckDb();
    }
  });
  return { backend };
});
