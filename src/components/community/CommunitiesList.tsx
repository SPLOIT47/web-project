import { useEffect, useRef, type RefObject } from "react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/store";
import { useCommunitiesStore } from "@/store/communitiesStore";
import type { CommunityTab } from "@/domain/community/CommunityTab";
import CommunityCard from "./CommunityCard";
import { mapCommunityToPreview } from "@/presentation/community/mapCommunityToPreview";

export default function CommunitiesList({
    tab,
    scrollRootRef,
}: {
    tab: CommunityTab;
    scrollRootRef?: RefObject<HTMLDivElement | null>;
}) {
    const { t } = useTranslation();
    const authUser = useAuthStore(s => s.user);
    const {
        all,
        my,
        manage,
        loading,
        loadingMore,
        load,
        loadMoreCatalog,
    } = useCommunitiesStore();

    const sentinelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (authUser) {
            void load(authUser.id, tab);
        }
    }, [tab, authUser, load]);

    useEffect(() => {
        if (tab !== "all") return;
        const root = scrollRootRef?.current ?? null;
        const target = sentinelRef.current;
        if (!target) return;

        const io = new IntersectionObserver(
            entries => {
                if (entries[0]?.isIntersecting) {
                    void loadMoreCatalog();
                }
            },
            { root, rootMargin: "160px", threshold: 0 },
        );
        io.observe(target);
        return () => io.disconnect();
    }, [tab, scrollRootRef, loadMoreCatalog, all.length]);

    if (loading) {
        return (
            <div className="opacity-60 text-center">{t("common.loading")}</div>
        );
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
        tab === "all"
            ? all
            : tab === "my"
              ? my
              : manage;

    if (list.length === 0) {
        return (
            <div className="opacity-60 text-center mt-6">
                {t("communities.noCommunitiesHere")}
            </div>
        );
    }

    return (
        <div className="fade-in">
            <div
                className="
        grid
        grid-cols-1
        tablet:grid-cols-2
        laptop:grid-cols-2
        desktop:grid-cols-3
        gap-3 tablet:gap-4
        pr-1 tablet:pr-2
    "
            >
                {list.map(c => (
                    <CommunityCard
                        key={c.id}
                        community={mapCommunityToPreview(c)}
                    />
                ))}
            </div>

            {tab === "all" && (
                <>
                    <div ref={sentinelRef} className="h-1 w-full" aria-hidden />
                    {loadingMore && (
                        <div className="opacity-60 text-center py-4 text-sm">
                            {t("common.loading")}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
