import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ServiceLocator } from "@/application/ServiceLocator";

import type { User } from "@/domain/user/User";
import type { LoginRequest } from "@/domain/auth/LoginRequest";
import type { RegisterRequest } from "@/domain/auth/RegisterRequest";

interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;

    isAuthenticated: boolean;

    login: (data: LoginRequest) => Promise<boolean>;
    register: (data: RegisterRequest) => Promise<boolean>;
    logout: () => Promise<void>;
    restoreSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            loading: false,
            error: null,
            isAuthenticated: false,

            login: async (data: LoginRequest) => {
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

                return true;
            },

            register: async (data: RegisterRequest) => {
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
                        loading: false,
                        error: null,
                    });
                }
            },
        }),
        { name: "auth-store" }
    )
);