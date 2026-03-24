import { create } from "zustand";
import { ServiceLocator } from "@/application/ServiceLocator";
import type { User } from "@/domain/user/User";
import type { EditProfilePayload } from "@/domain/user/EditProfilePayload";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";

interface ProfileState {
    user: User | null;
    loading: boolean;
    error: string | null;

    loadProfile: (userId: string) => Promise<void>;
    updateProfile: (data: EditProfilePayload) => Promise<boolean>;
    clearProfile: () => void;
    clearError: () => void;
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
        if (!user) return false;

        set({ loading: true, error: null });

        try {
            const updated = await ServiceLocator.userService.updateProfile(
                user.id,
                data
            );

            set({ user: updated, loading: false });
            useUserStore.getState().upsertMany([updated]);
            const auth = useAuthStore.getState().user;
            if (auth && updated.id === auth.id) {
                useAuthStore.getState().patchUser({
                    name: updated.name,
                    surname: updated.surname,
                    bio: updated.bio,
                    birthday: updated.birthday,
                    city: updated.city,
                    education: updated.education,
                    languages: updated.languages,
                    avatarUrl: updated.avatarUrl,
                });
            }
            return true;
        } catch (e) {
            console.error(e);
            set({ error: "Failed to update profile", loading: false });
            return false;
        }
    },

    clearProfile: () => {
        set({ user: null, loading: false, error: null });
    },

    clearError: () => {
        set({ error: null });
    },
}));