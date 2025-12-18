import type { SearchService } from "@/application/search/SearchService";
import type { SearchQuery } from "@/domain/search/SearchQuery";
import type { SearchResult } from "@/domain/search/SearchResult";

import { loadDb } from "./database";
import { mockResponse } from "./mockApi";

export class MockSearchService implements SearchService {
    async search(
        { text, scope }: SearchQuery
    ): Promise<SearchResult[]> {
        const q = text.toLowerCase().trim();
        if (!q) return mockResponse([]);

        const db = loadDb();

        if (scope === "users" || scope === "friends") {
            const users = db.users.filter(u => {
                const fullName =
                    `${u.name ?? ""} ${u.surname ?? ""}`.toLowerCase();

                return (
                    u.username.toLowerCase().includes(q) ||
                    fullName.includes(q)
                );
            });

            return mockResponse(
                users.map(u => ({
                    type: "user",
                    user: u,
                }))
            );
        }

        return mockResponse([]);
    }
}