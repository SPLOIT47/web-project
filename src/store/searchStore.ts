import { create } from "zustand";
import { ServiceLocator } from "@/application/ServiceLocator";
import type { SearchResult } from "@/domain/search/SearchResult";
import type { SearchScope } from "@/domain/search/SearchQuery";

interface SearchState {
    query: string;
    scope: SearchScope;
    results: SearchResult[];
    loading: boolean;

    search: (q: string, scope: SearchScope) => Promise<void>;
    clear: () => void;
}

export const useSearchStore = create<SearchState>(set => ({
    query: "",
    scope: "users",
    results: [],
    loading: false,

    search: async (q, scope) => {
        set({ loading: true, query: q, scope });

        const results = await ServiceLocator.searchService.search({
            text: q,
            scope,
        });

        set({ results, loading: false });
    },

    clear: () => set({ results: [], query: "" }),
}));