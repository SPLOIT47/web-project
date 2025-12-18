import {CommunityTypeId} from "@/domain/community/CommunityTypeId";

export interface CommunityType {
    id: CommunityTypeId;
    label: string;
    joinPolicy: "open" | "request" | "invite";
    hasDate?: boolean;
}