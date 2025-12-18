import { create } from "zustand";
import { ServiceLocator } from "@/application/ServiceLocator";

import type { User } from "@/domain/user/User";
import type { LoginRequest } from "@/domain/auth/LoginRequest";
import type { RegisterRequest } from "@/domain/auth/RegisterRequest";
import {usePostStore} from "@/store/postStore";

interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;

    login: (data: LoginRequest) => Promise<boolean>;
    register: (data: RegisterRequest) => Promise<boolean>;
    logout: () => Promise<void>;
    restoreSession: () => Promise<void>;
    deleteAccount: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    token: null,
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
            token: response.token,
            loading: false,
            error: null,
        });

        await usePostStore.getState().loadFeed();

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
            token: response.token,
            loading: false,
            error: null,
        });

        return true;
    },

    logout: async () => {
        await ServiceLocator.authService.logout();

        set({
            user: null,
            token: null,
            error: null,
        });
    },

    restoreSession: async () => {
        set({ loading: true });

        const session = await ServiceLocator.authService.getCurrentSession();

        if (session) {
            set({
                user: session.user,
                token: session.token,
                loading: false,
                error: null,
            });
        } else {
            set({
                user: null,
                token: null,
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
            token: null,
            error: null,
        });
    },
}));