import { create } from "zustand";
import { ServiceLocator } from "@/application/ServiceLocator";
import type { Community } from "@/domain/community/Community";

interface CommunityState {
    communities: Community[];

    loadAll: () => Promise<void>;
    getById: (id: string) => Community | undefined;
}

export const useCommunityStore = create<CommunityState>((set, get) => ({
    communities: [],

    loadAll: async () => {
        const data = await ServiceLocator.communityService.getAll();
        set({ communities: data });
    },

    getById: (id: string) =>
        get().communities.find(c => c.id === id),
}));