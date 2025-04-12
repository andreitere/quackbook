import { useProjects } from "@/store/project"
import { computed } from "vue"
import { createGlobalState } from "@vueuse/core"
import { backendRegistry } from "@/config/backendRegistry"
import type { SQLBackend, SQLBackendType, ExecuteArgs } from "@/types/database"

export const useSQLBackend = createGlobalState(() => {
  const $projects = useProjects()

  const backend = computed<SQLBackend>(() => {
    const backendType = $projects.activeProjectMeta.sql.backend as SQLBackendType
    const config = backendRegistry[backendType] || backendRegistry.duckdb_wasm
    return config.factory()
  })

  // Expose methods directly to avoid .value access
  const execute = async (args: ExecuteArgs) => {
    return backend.value.execute(args)
  }

  const connect = async () => {
    return backend.value.connect()
  }

  const disconnect = async () => {
    return backend.value.disconnect()
  }

  return {
    backend,
    execute,
    connect,
    disconnect,
  }
})
