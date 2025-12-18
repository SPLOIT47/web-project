import type { CommunityDetails } from "../../../domain/community/details/CommunityDetails";

export interface CommunityDetailsService {
    getByCommunityId(communityId: string): Promise<CommunityDetails>
    update(
        communityId: string,
        data: Partial<CommunityDetails>
    ): Promise<CommunityDetails>;
}