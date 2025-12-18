import type { Community } from "@/domain/community/Community";

import AboutCommunityCard from "./community/AboutCommunityCard";
import FriendsInCommunityCard from "./community/FriendsInCommunityCard";
import FollowersCard from "./community/FollowersCard";
import ContactsCard from "./community/ContactsCard";

type Props = {
    community: Community;
};

export default function CommunityRightSidebar({ community }: Props) {
    return (
        <div className="sticky top-24 flex flex-col gap-4">
            <AboutCommunityCard community={community} />
            <FriendsInCommunityCard community={community} />
            <FollowersCard community={community} />
            <ContactsCard communityId={community.id} />
        </div>
    );
}