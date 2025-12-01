import { Identifiable } from "@/domain/common/Identifiable";
import { Timestamped } from "@/domain/common/Timestamped";
import { AvatarEntity } from "@/domain/common/AvatarEntity";
import { Subscribable } from "@/domain/common/Subscribable";
import { Messageable } from "@/domain/common/Messageable";
import { Postable } from "@/domain/common/Postable";

export interface User
    extends Identifiable,
        Timestamped,
        AvatarEntity,
        Subscribable,
        Messageable,
        Postable
{
    username: string;

    displayName: string;

    bio?: string;

    birthday?: string;

    city?: string;

    education?: string;

    friends: string[];

    communities: string[];

    languages?: string[];
}