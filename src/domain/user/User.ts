import {AvatarEntity} from "@/domain/common/AvatarEntity";
import {Timestamped} from "@/domain/common/Timestamped";
import {Identifiable} from "@/domain/common/Identifiable";
import {Subscribable} from "@/domain/common/Subscribable";
import {Messageable} from "@/domain/common/Messageable";
import {Postable} from "@/domain/common/Postable";

export interface User
    extends Identifiable,
        Timestamped,
        AvatarEntity,
        Subscribable,
        Messageable,
        Postable
{
    username: string;
    email: string;

    name: string;
    surname: string;

    bio?: string;
    birthday?: string;
    city?: string;
    education?: string;

    friends: string[];
    incomingRequests: string[];
    outgoingRequests: string[];

    communities: string[];
    languages?: string[];
}