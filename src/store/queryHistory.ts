import { useStorage } from "@vueuse/core";

export interface QueryHistoryEntry {
  id: number;
  query: string;
  timestamp: number;
  duration?: number;
  error?: string;
}

export const useQueryHistory = () => {
  const history = useStorage<QueryHistoryEntry[]>("queryHistory", []);
  const maxEntries = 100; // Maximum number of entries to keep

  const addEntry = (entry: Omit<QueryHistoryEntry, "id" | "timestamp">) => {
    const newEntry: QueryHistoryEntry = {
      id: Date.now(),
      timestamp: Date.now(),
      ...entry,
    };

    history.value = [newEntry, ...history.value].slice(0, maxEntries);
  };

  const clearHistory = () => {
    history.value = [];
  };

  return {
    history,
    addEntry,
    clearHistory,
  };
}; 