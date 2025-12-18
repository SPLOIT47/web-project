import { CommunityType } from "./CommunityType";
import {CommunityTypeId} from "@/domain/community/CommunityTypeId";

export const COMMUNITY_TYPES: Record<string, CommunityType> = {
    public: {
        id: CommunityTypeId.Public,
        label: "Public Page",
        joinPolicy: "open",
    },
};