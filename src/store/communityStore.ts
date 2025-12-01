import { create } from "zustand";
import { ServiceLocator } from "@/application/ServiceLocator";
import type { Community } from "@/domain/community/Community";

interface CommunityState {
    communities: Community[];
    loadAll: () => Promise<void>;
}

export const useCommunityStore = create<CommunityState>((set) => ({
    communities: [],

    loadAll: async () => {
        const data = await ServiceLocator.communityService.getAll();
        set({ communities: data });
    },
}));