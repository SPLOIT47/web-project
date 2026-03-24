import type { CommunityDetailsService } from "@/application/chat/details/CommunityDetailsService";
import type { CommunityDetails } from "@/domain/community/details/CommunityDetails";
import { httpRequest } from "./httpClient";

type DetailsApi = {
    details: {
        communityId: string;
        shortDescription: string | null;
        fullDescription: string | null;
        tags: string[] | null;
        statusType: string | null;
        statusOpensAt: string | null;
        addressCity: string | null;
        addressStreet: string | null;
        addressBuilding: string | null;
        contactsEmail: string | null;
        contactsPhone: string | null;
        contactsTelegram: string | null;
        contactsVk: string | null;
        contactsWebsite: string | null;
    } | null;
    links: {
        linkId: string;
        communityId: string;
        title: string;
        url: string;
        pinned: boolean;
        position: number;
    }[];
};

export class HttpCommunityDetailsService implements CommunityDetailsService {
    async getByCommunityId(communityId: string): Promise<CommunityDetails> {
        const res = await httpRequest<DetailsApi>(
            `/api/communities/${encodeURIComponent(communityId)}/details`,
        );
        const d = res.details;
        return {
            communityId,
            shortDescription: d?.shortDescription ?? undefined,
            fullDescription: d?.fullDescription ?? undefined,
            tags: d?.tags ?? undefined,
            status: d?.statusType
                ? {
                      type:
                          d.statusType === "closed" ? "closed" : "open",
                      opensAt: d.statusOpensAt ?? undefined,
                  }
                : undefined,
            address:
                d?.addressCity || d?.addressStreet
                    ? {
                          city: d?.addressCity ?? undefined,
                          street: d?.addressStreet ?? undefined,
                          building: d?.addressBuilding ?? undefined,
                      }
                    : undefined,
            contacts: {
                email: d?.contactsEmail ?? undefined,
                phone: d?.contactsPhone ?? undefined,
                telegram: d?.contactsTelegram ?? undefined,
                vk: d?.contactsVk ?? undefined,
                website: d?.contactsWebsite ?? undefined,
            },
            links: res.links?.map(l => ({
                title: l.title,
                url: l.url,
                pinned: l.pinned,
            })),
        };
    }

    async update(
        communityId: string,
        data: Partial<CommunityDetails>,
    ): Promise<CommunityDetails> {
        await httpRequest(`/api/communities/${encodeURIComponent(communityId)}/details`, {
            method: "PATCH",
            body: JSON.stringify({
                shortDescription: data.shortDescription,
                fullDescription: data.fullDescription,
                tags: data.tags,
                status: data.status
                    ? {
                          type: data.status.type,
                          opensAt: data.status.opensAt,
                      }
                    : undefined,
                address: data.address,
                contacts: data.contacts,
                links: data.links,
            }),
        });
        return this.getByCommunityId(communityId);
    }
}
