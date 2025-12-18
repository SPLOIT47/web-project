import { useTranslation } from "react-i18next";
import Card from "@components/ui/Card";
import Avatar from "@components/ui/Avatar";
import type { Community } from "@/domain/community/Community";
import {useModalStore} from "@/store/modalStore";

export default function FollowersCard({community,}: { community: Community; }) {
    const { t } = useTranslation();
    const followers = community.followers;
    const openFollowers = useModalStore(s => s.openCommunityFollowers);

    return (
        <Card>
            <h3 className="font-semibold neon-text mb-3">
                {t("profile.followers")}
            </h3>

            <div className="flex gap-2 flex-wrap">
                {followers.slice(0, 8).map(id => (
                    <Avatar key={id} size={36} />
                ))}
            </div>

            <div className="text-xs opacity-60 mt-2">
                {followers.length} {t("communityRightbar.followers")}
            </div>

            {followers.length > 0 && (
                <div
                    className="
                        mt-2 text-sm text-[var(--primary)]
                        cursor-pointer hover:underline select-none
                    "
                    onClick={() => openFollowers(community.followers)}
                >
                    {t("communityRightbar.showAllFollowers")}
                </div>
            )}
        </Card>
    );
}