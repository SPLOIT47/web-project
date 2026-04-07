import { create } from "zustand";
import { ServiceLocator } from "@/application/ServiceLocator";
import type { Community } from "@/domain/community/Community";
import type { CommunityTab } from "@/domain/community/CommunityTab";

const CATALOG_PAGE_SIZE = 20;

interface CommunitiesState {
    all: Community[];
    allHasMore: boolean;
    my: Community[];
    manage: Community[];
    loading: boolean;
    loadingMore: boolean;

    load: (userId: string, tab: CommunityTab) => Promise<void>;
    loadMoreCatalog: () => Promise<void>;
}

export const useCommunitiesStore = create<CommunitiesState>((set, get) => ({
    all: [],
    allHasMore: true,
    my: [],
    manage: [],
    loading: false,
    loadingMore: false,

    load: async (userId, tab) => {
        set({ loading: true });
        const service = ServiceLocator.communityService;
        try {
            if (tab === "all") {
                const page = await service.searchCommunities(
                    0,
                    CATALOG_PAGE_SIZE,
                );
                set({
                    all: page,
                    allHasMore: page.length >= CATALOG_PAGE_SIZE,
                });
            } else if (tab === "my") {
                set({ my: await service.getMine(userId) });
            } else if (tab === "manage") {
                const joined = await service.getMine(userId);
                set({
                    manage: joined.filter(c => c.ownerUserId === userId),
                });
            }
        } finally {
            set({ loading: false });
        }
    },

    loadMoreCatalog: async () => {
        const { loadingMore, allHasMore, all, loading } = get();
        if (loading || loadingMore || !allHasMore) return;
        set({ loadingMore: true });
        try {
            const service = ServiceLocator.communityService;
            const page = await service.searchCommunities(
                all.length,
                CATALOG_PAGE_SIZE,
            );
            set({
                all: [...all, ...page],
                allHasMore: page.length >= CATALOG_PAGE_SIZE,
            });
        } finally {
            set({ loadingMore: false });
        }
    },
}));
