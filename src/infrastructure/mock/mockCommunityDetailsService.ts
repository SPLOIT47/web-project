import type { CommunityDetailsService } from "@/application/chat/details/CommunityDetailsService";
import type { CommunityDetails } from "@/domain/community/details/CommunityDetails";

import { loadDb, saveDb } from "./database";
import { mockResponse } from "./mockApi";

export class MockCommunityDetailsService
    implements CommunityDetailsService
{
    async getByCommunityId(
        communityId: string
    ): Promise<CommunityDetails> {
        const db = loadDb();

        let details = db.communityDetails.find(
            d => d.communityId === communityId
        );

        if (!details) {
            details = {
                communityId,

                shortDescription: "",
                fullDescription: "",

                tags: [],

                status: {
                    type: "open",
                },

                address: {
                    city: "",
                    street: "",
                },

                contacts: {},
                links: [],
            };

            db.communityDetails.push(details);
            saveDb(db);
        }

        return mockResponse(details);
    }

    async update(
        communityId: string,
        data: Partial<CommunityDetails>
    ): Promise<CommunityDetails> {
        const db = loadDb();

        let details = db.communityDetails.find(
            d => d.communityId === communityId
        );

        if (!details) {
            details = {
                communityId,
                shortDescription: "",
                fullDescription: "",
                tags: [],
                status: { type: "open" },
                address: { city: "", street: "" },
                contacts: {},
                links: [],
            };

            db.communityDetails.push(details);
        }

        Object.assign(details, data);
        saveDb(db);

        return mockResponse(details);
    }
}