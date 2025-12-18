export interface CommunityDetails {
    communityId: string;

    shortDescription?: string;
    fullDescription?: string;

    tags?: string[];

    status?: {
        type: "open" | "closed";
        opensAt?: string;
    };

    address?: {
        city?: string;
        street?: string;
        building?: string;
    };

    contacts?: {
        email?: string;
        phone?: string;
        telegram?: string;
        vk?: string;
        website?: string;
    };

    links?: {
        title: string;
        url: string;
        pinned?: boolean;
    }[];
}