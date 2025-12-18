import {create} from "zustand";
import { ServiceLocator } from "@/application/ServiceLocator";
import type { CommunityDetails } from "@/domain/community/details/CommunityDetails";


interface CommunityDetailsState {
    details: CommunityDetails | null;
    loading: boolean;
    error?: string;

    load: (communityId: string) => Promise<void>;
    update: (communityId: string, data: CommunityDetails) => Promise<void>;
}

export const useCommunityDetailsStore = create<CommunityDetailsState>((set) => ({
    details: null,
    loading: false,

    load: async (communityId) => {
        set({ loading: true });

        const details =
            await ServiceLocator.communityDetailsService.getByCommunityId(
                communityId
            );

        set({
            details,
            loading: false,
        });
    },

    update: async (communityId, data) => {
        const updated =
            await ServiceLocator.communityDetailsService.update(
                communityId,
                data
            );

        set({ details: updated });
    },
}));