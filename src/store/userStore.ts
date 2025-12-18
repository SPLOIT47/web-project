import { create } from "zustand";
import { ServiceLocator } from "@/application/ServiceLocator";
import type { User } from "@/domain/user/User";

interface UserState {
    users: User[];
    loadAll: () => Promise<void>;
    getById: (id: string) => User | undefined;

    upsertMany: (users: User[]) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
    users: [],

    loadAll: async () => {
        const data = await ServiceLocator.userService.getAll();
        set({ users: data });
    },

    getById: (id: string) => {
        return get().users.find(u => u.id === id);
    },

    upsertMany: (incoming) => {
        set(state => {
            const map = new Map(state.users.map(u => [u.id, u]));

            for (const user of incoming) {
                map.set(user.id, user);
            }

            return { users: Array.from(map.values()) };
        });
    },
}));