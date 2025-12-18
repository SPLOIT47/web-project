import { Community } from "@/domain/community/Community";
import { CommunityPreview } from "./CommunityPreview";

export function mapCommunityToPreview(
    community: Community
): CommunityPreview {
    return {
        id: community.id,
        name: community.name,
        description: community.description,

        avatarUrl: community.avatarUrl,
        coverUrl: community.coverUrl,

        membersCount: community.followers.length,
        type: community.type,
    };
}