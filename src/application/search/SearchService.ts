import type { SearchQuery } from "../../domain/search/SearchQuery";
import type { SearchResult } from "../../domain/search/SearchResult";

export interface SearchService {
    search(query: SearchQuery): Promise<SearchResult[]>;
}