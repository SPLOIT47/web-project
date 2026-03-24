import type { SearchService } from "@/application/search/SearchService";
import type { SearchQuery } from "@/domain/search/SearchQuery";
import type { SearchResult } from "@/domain/search/SearchResult";
import { httpRequest } from "./httpClient";
import {
    type ApiProfile,
    type CommunityRow,
    type MemberRow,
    mapApiProfileToUser,
    mapCommunityRow,
} from "./mappers";

type SearchProfilesResponse = {
    results: ApiProfile[];
    hasMore: boolean;
    nextOffset: number;
};

export class HttpSearchService implements SearchService {
    async search(query: SearchQuery): Promise<SearchResult[]> {
        const q = query.text.trim();
        if (!q) return [];

        if (query.scope === "communities") {
            const rows = await httpRequest<CommunityRow[]>(
                `/api/communities/search?q=${encodeURIComponent(q)}`,
            );
            const out: SearchResult[] = [];
            for (const row of rows) {
                try {
                    const members = await httpRequest<MemberRow[]>(
                        `/api/communities/${encodeURIComponent(row.communityId)}/members`,
                    );
                    out.push({
                        type: "community",
                        community: mapCommunityRow(row, members),
                    });
                } catch {
                    out.push({
                        type: "community",
                        community: mapCommunityRow(row, []),
                    });
                }
            }
            return out;
        }

        const res = await httpRequest<SearchProfilesResponse>(
            `/api/profiles/search?q=${encodeURIComponent(q)}&limit=20&offset=0`,
        );
        return res.results.map(p => ({
            type: "user",
            user: mapApiProfileToUser(p),
        }));
    }
}
