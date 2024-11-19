import {useProjects} from "@/store/project.ts";
import {computed} from "vue";
import {useDuckDb} from "@/hooks/useDuckDb.ts";
import {useDuckDBServer} from "@/hooks/useDuckDBServer.ts";

export const useSQLBackend = () => {
  const $project = useProjects();
  const backend = computed<any>(() => {
    switch ($project.activeProject.value.sql.backend) {
      case 'duckdb_server':
        console.log('is duckdb_server');
        return useDuckDBServer()
      case 'duckdb_wasm':
        console.log('is duckdb_wasm');
        return useDuckDb()
      default:
        return useDuckDb()
    }
  })
  return {backend}
}