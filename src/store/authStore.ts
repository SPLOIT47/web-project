import { create } from "zustand";
import { ServiceLocator } from "@/application/ServiceLocator";

import type { User } from "@/domain/user/User";
import type { LoginRequest } from "@/domain/auth/LoginRequest";
import type { RegisterRequest } from "@/domain/auth/RegisterRequest";
import { usePostStore } from "@/store/postStore";
import { useUserStore } from "@/store/userStore";

interface AuthState {
    user: User | null;
    accessToken: string | null;
    loading: boolean;
    error: string | null;

    login: (data: LoginRequest) => Promise<boolean>;
    register: (data: RegisterRequest) => Promise<boolean>;
    logout: () => Promise<void>;
    restoreSession: () => Promise<void>;
    deleteAccount: () => Promise<void>;
    /** Локально обновить поля пользователя после настроек / профиля */
    patchUser: (partial: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    accessToken: null,
    loading: false,
    error: null,

    login: async (data) => {
        set({ loading: true, error: null });

        const response = await ServiceLocator.authService.login(data);

        if (!response) {
            set({
                loading: false,
                error: "Invalid credentials",
            });
            return false;
        }

        set({
            user: response.user,
            accessToken: response.accessToken,
            loading: false,
            error: null,
        });

        useUserStore.getState().upsertMany([response.user]);
        void usePostStore.getState().loadFeed();

        return true;
    },

    register: async (data) => {
        set({ loading: true, error: null });

        const response = await ServiceLocator.authService.register(data);

        if (!response) {
            set({
                loading: false,
                error: "User already exists",
            });
            return false;
        }

        set({
            user: response.user,
            accessToken: response.accessToken,
            loading: false,
            error: null,
        });

        useUserStore.getState().upsertMany([response.user]);

        return true;
    },

    logout: async () => {
        try {
            await ServiceLocator.authService.logout();
        } finally {
            set({
                user: null,
                accessToken: null,
                error: null,
            });
            usePostStore.getState().clear();
        }
    },

    restoreSession: async () => {
        set({ loading: true });

        const session = await ServiceLocator.authService.getCurrentSession();

        if (session) {
            set({
                user: session.user,
                accessToken: session.accessToken,
                loading: false,
                error: null,
            });
            useUserStore.getState().upsertMany([session.user]);
            void usePostStore.getState().loadFeed();
        } else {
            set({
                user: null,
                accessToken: null,
                loading: false,
                error: null,
            });
        }
    },

    deleteAccount: async () => {
        const user = get().user;
        if (!user) return;

        await ServiceLocator.authService.deleteAccount(user.id);

        set({
            user: null,
            accessToken: null,
            error: null,
        });
    },

    patchUser: partial => {
        set(state => ({
            user: state.user ? { ...state.user, ...partial } : null,
        }));
    },
}));