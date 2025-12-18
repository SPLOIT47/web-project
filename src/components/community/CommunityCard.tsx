import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {CommunityPreview} from "@/presentation/community/CommunityPreview";

type CommunityCardProps = {
    community: CommunityPreview
};

export default function CommunityCard({ community } : CommunityCardProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/communities/${community.id}`)}
            className="
                p-3 mobile:p-4 
                rounded-xl border border-[var(--border-color)]
                bg-[var(--bg-surface)]
                shadow-[0_0_12px_var(--primary-glow)]
                hover:shadow-[0_0_18px_var(--primary-glow)]
                transition-all 
                flex flex-col mobile:flex-row 
                gap-3 mobile:gap-4 
                fade-in cursor-pointer
            "
        >
            <img
                src={community.coverUrl}
                className="
                    w-full mobile:w-20 mobile:h-20 
                    h-32 mobile:h-auto
                    rounded-xl object-cover 
                    border border-[var(--border-color)]
                    shrink-0
                "
            />

            <div className="flex-1 flex flex-col justify-between min-w-0">

                <div>
                    <h3 className="
                        text-base mobile:text-lg 
                        font-semibold neon-text
                        truncate
                    ">
                        {community.name}
                    </h3>

                    <div className="opacity-70 text-xs mobile:text-sm mt-1">
                        {community.membersCount} {t("communities.members")}
                    </div>

                    <div className="
                        opacity-60 
                        text-xs mt-1
                        line-clamp-2 mobile:line-clamp-3
                    ">
                        {community.description}
                    </div>
                </div>
            </div>
        </div>
    );
}