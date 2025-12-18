import { create } from "zustand";
import { ServiceLocator } from "@/application/ServiceLocator";
import type { Community } from "@/domain/community/Community";
import type { CommunityTab } from "@/domain/community/CommunityTab";

interface CommunitiesState {
    all: Community[];
    my: Community[];
    manage: Community[];
    loading: boolean;

    load: (userId: string, tab: CommunityTab) => Promise<void>;
}

export const useCommunitiesStore = create<CommunitiesState>((set) => ({
    all: [],
    my: [],
    manage: [],
    loading: false,

    load: async (userId, tab) => {
        set({ loading: true });

        const service = ServiceLocator.communityService;

        if (tab === "all") {
            set({ all: await service.getAll() });
        }

        if (tab === "my") {
            const all = await service.getAll();
            set({
                my: all.filter(c => c.followers.includes(userId)),
            });
        }

        if (tab === "manage") {
            const all = await service.getAll();
            set({
                manage: all.filter(
                    c => c.admins.includes(userId) || c.moderators?.includes(userId)
                ),
            });
        }

        set({ loading: false });
    },
}));