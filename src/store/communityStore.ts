import { create } from "zustand";
import { ServiceLocator } from "@/application/ServiceLocator";
import type { Community } from "@/domain/community/Community";

interface CommunityState {
    communities: Community[];

    loadAll: () => Promise<void>;
    getById: (id: string) => Community | undefined;
    upsertMany: (incoming: Community[]) => void;
}

export const useCommunityStore = create<CommunityState>((set, get) => ({
    communities: [],

    loadAll: async () => {
        const data = await ServiceLocator.communityService.getAll();
        set({ communities: data });
    },

    getById: (id: string) =>
        get().communities.find(c => c.id === id),

    upsertMany: incoming => {
        if (incoming.length === 0) return;
        set(state => {
            const map = new Map(state.communities.map(c => [c.id, c]));
            for (const c of incoming) {
                map.set(c.id, c);
            }
            return { communities: [...map.values()] };
        });
    },
}));