import { useTranslation } from "react-i18next";
import Card from "@components/ui/Card";
import Icon from "@components/ui/Icon";
import type { Community } from "@/domain/community/Community";
import {useModalStore} from "@/store/modalStore";

export default function AboutCommunityCard({ community }: { community: Community }) {
    const { t } = useTranslation();
    const openDetails = useModalStore(s => s.openCommunityDetails);

    return (
        <Card>
            <h3 className="font-semibold neon-text mb-3">
                {t("communityRightbar.about")}
            </h3>

            <div className="flex flex-col gap-2 text-sm opacity-80">

                <div className="flex gap-2 items-center">
                    <Icon name="users" />
                    <span>{community.followers.length} {t("communityRightbar.followers")}</span>
                </div>

                <div className="flex gap-2 items-center">
                    <Icon name="tag" />
                    <span>{community.category}</span>
                </div>

                <div className="flex gap-2 items-center">
                    <Icon name="lock-open" />
                    <span>
                        {community.type === "public"
                            ? t("communityRightbar.publicCommunity")
                            : t("communityRightbar.closedCommunity")}
                    </span>
                </div>
            </div>

            <div
                className="
                    mt-3 text-sm text-[var(--primary)]
                    cursor-pointer hover:underline
                    select-none
                "
                onClick={() => openDetails(community.id)}
            >
                {t("communityRightbar.showDetails")}
            </div>
        </Card>
    );
}