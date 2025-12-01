import { create } from "zustand";
import { ServiceLocator } from "@/application/ServiceLocator";
import type { User } from "@/domain/user/User";

interface UserState {
    users: User[];
    loadAll: () => Promise<void>;
    getById: (id: string) => User | undefined;
}

export const useUserStore = create<UserState>((set, get) => ({
    users: [],

    loadAll: async () => {
        const data = await ServiceLocator.userService.getAllUsers();
        set({ users: data });
    },

    getById: (id: string) => {
        return get().users.find(u => u.id === id);
    }
}));