import { useTranslation } from "react-i18next";
import Card from "@components/ui/Card";
import Avatar from "@components/ui/Avatar";
import { useAuthStore } from "@/store";
import type { Community } from "@/domain/community/Community";

export default function FriendsInCommunityCard({
                                                   community,
                                               }: {
    community: Community;
}) {
    const { t } = useTranslation();
    const authUser = useAuthStore(s => s.user);

    if (!authUser) return null;

    const friendsInCommunity = authUser.friends.filter(id =>
        community.followers.includes(id)
    );

    if (friendsInCommunity.length === 0) return null;

    return (
        <Card>
            <h3 className="font-semibold neon-text mb-3">
                {t("communityRightbar.friendsInCommunity")}
            </h3>

            <div className="flex gap-2 flex-wrap">
                {friendsInCommunity.slice(0, 6).map(id => (
                    <Avatar key={id} size={36} />
                ))}
            </div>

            <div className="text-xs opacity-60 mt-2">
                {t("communityRightbar.friends", { count: friendsInCommunity.length })}
            </div>
        </Card>
    );
}