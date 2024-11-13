import { useStorage } from "@vueuse/core";
import type { Ref } from "vue";

export const useSnippets = () => {
	const snippets: Ref<{ label: string; snippet: string; id: number }[]> =
		useStorage("snippets", []);

	const saveSnippet = (label: string, snippet: string) => {
		snippets.value.push({ label, snippet, id: Date.now().valueOf() });
	};
	const removeSnippet = (id: number) => {
		snippets.value = snippets.value.filter((s) => s.id !== id);
	};
	return { saveSnippet, snippets, removeSnippet };
};
