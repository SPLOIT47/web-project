import { CommunityTypeId } from "@/domain/community/CommunityTypeId";

export interface CommunityPreview {
    id: string;
    name: string;
    description?: string;

    avatarUrl?: string;
    coverUrl?: string;

    membersCount: number;
    type: CommunityTypeId;
}