import { create } from "zustand";
import { ServiceLocator } from "@/application/ServiceLocator";
import type { User } from "@/domain/user/User";
import type { EditProfilePayload } from "@/domain/user/EditProfilePayload";

interface ProfileState {
    user: User | null;
    loading: boolean;
    error: string | null;

    loadProfile: (userId: string) => Promise<void>;
    updateProfile: (data: EditProfilePayload) => Promise<void>;
    clearProfile: () => void;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
    user: null,
    loading: false,
    error: null,

    loadProfile: async (userId: string) => {
        set({ loading: true, error: null });

        try {
            const user = await ServiceLocator.userService.getById(userId);
            if (!user) {
                set({ error: "Profile not found", loading: false });
                return;
            }

            set({ user, loading: false });
        } catch (e) {
            console.error(e);
            set({ error: "Failed to load profile", loading: false });
        }
    },

    updateProfile: async (data: EditProfilePayload) => {

        const user = get().user;
        if (!user) return;

        set({ loading: true, error: null });

        try {
            const updated = await ServiceLocator.userService.updateProfile(
                user.id,
                data
            );

            console.log("updateProfile payload =", data);
            console.log("updateProfile result  =", updated);

            set({ user: updated, loading: false });
        } catch (e) {
            console.error(e);
            set({ error: "Failed to update profile", loading: false });
        }
    },

    clearProfile: () => {
        set({ user: null, loading: false, error: null });
    },
}));