import {CommunityTypeId} from "@/domain/community/CommunityTypeId";

export interface CreateCommunityPayload {
    name: string;
    type: CommunityTypeId;
    category: string;
    description?: string;
    avatarUrl?: string;
    coverUrl?: string;
}