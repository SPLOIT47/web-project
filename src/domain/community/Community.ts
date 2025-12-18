import { Identifiable } from "@/domain/common/Identifiable";
import { Timestamped } from "@/domain/common/Timestamped";
import { AvatarEntity } from "@/domain/common/AvatarEntity";
import { Subscribable } from "@/domain/common/Subscribable";
import { AdminManageable } from "@/domain/common/AdminManageable";
import { Postable } from "@/domain/common/Postable";
import {CommunityTypeId} from "@/domain/community/CommunityTypeId";

export interface Community
    extends Identifiable,
        Timestamped,
        AvatarEntity,
        Subscribable,
        AdminManageable,
        Postable
{
    coverUrl: string;
    category: string;
    type: CommunityTypeId;

    description?: string;
}