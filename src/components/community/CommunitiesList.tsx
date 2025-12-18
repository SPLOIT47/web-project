import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/store";
import { useCommunitiesStore } from "@/store/communitiesStore";
import type { CommunityTab } from "@/domain/community/CommunityTab";
import CommunityCard from "./CommunityCard";
import {mapCommunityToPreview} from "@/presentation/community/mapCommunityToPreview";

export default function CommunitiesList({ tab }: { tab: CommunityTab }) {
    const { t } = useTranslation();
    const authUser = useAuthStore(s => s.user);
    const { all, my, manage, loading, load } = useCommunitiesStore();

    useEffect(() => {
        if (authUser) {
            load(authUser.id, tab);
        }
    }, [tab, authUser, load]);

    if (loading) {
        return <div className="opacity-60 text-center">{t("common.loading")}</div>;
    }

    if (tab === "search") {
        return (
            <div className="w-full fade-in">
                <input
                    placeholder={t("header.search")}
                    className="
                        w-full bg-[var(--bg-surface)]
                        border border-[var(--border-color)]
                        p-3 rounded-xl shadow-sm
                        focus:ring-2 focus:ring-[var(--primary)]
                        transition-all
                    "
                />
            </div>
        );
    }

    const list =
        tab === "all" ? all :
            tab === "my" ? my :
                manage;

    if (list.length === 0) {
        return (
            <div className="opacity-60 text-center mt-6">
                {t("communities.noCommunitiesHere")}
            </div>
        );
    }

    return (
        <div className="
        grid
        grid-cols-1
        tablet:grid-cols-2
        laptop:grid-cols-2
        desktop:grid-cols-3
        gap-3 tablet:gap-4
        pr-1 tablet:pr-2
        fade-in
    ">
            {list.map(c => (
                <CommunityCard
                    key={c.id}
                    community={mapCommunityToPreview(c)}
                />
            ))}
        </div>
    );
}