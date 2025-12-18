import { create } from "zustand";
import { ServiceLocator } from "@/application/ServiceLocator";
import type { User } from "@/domain/user/User";
import type { FriendTab } from "@/domain/friend/FriendTab";

type Relation = "none" | "friends" | "incoming" | "outgoing";

interface FriendsState {
    friends: User[];
    incoming: User[];
    outgoing: User[];
    loading: boolean;

    load: (userId: string, tab: FriendTab) => Promise<void>;

    sendRequest: (fromId: string, toId: string) => Promise<void>;
    accept: (userId: string, fromId: string) => Promise<void>;
    decline: (userId: string, fromId: string) => Promise<void>;
    cancel: (userId: string, toId: string) => Promise<void>;
    remove: (userId: string, friendId: string) => Promise<void>;

    getRelation: (targetId: string) => Relation;
}

export const useFriendsStore = create<FriendsState>((set, get) => ({
    friends: [],
    incoming: [],
    outgoing: [],
    loading: false,

    async load(userId, tab) {
        set({ loading: true });

        const service = ServiceLocator.userService;

        if (tab === "friends") {
            set({ friends: await service.getFriends(userId) });
        }

        if (tab === "requests") {
            set({ incoming: await service.getIncomingRequests(userId) });
        }

        if (tab === "outgoing") {
            set({ outgoing: await service.getOutgoingRequests(userId) });
        }

        set({ loading: false });
    },

    async sendRequest(fromId, toId) {
        await ServiceLocator.userService.sendFriendRequest(fromId, toId);

        set(state => ({
            outgoing: [...state.outgoing, { id: toId } as User],
        }));
    },

    async accept(userId, fromId) {
        await ServiceLocator.userService.acceptFriendRequest(userId, fromId);

        set(state => ({
            incoming: state.incoming.filter(u => u.id !== fromId),
            friends: [...state.friends, state.incoming.find(u => u.id === fromId)!],
        }));
    },

    async decline(userId, fromId) {
        await ServiceLocator.userService.declineFriendRequest(userId, fromId);

        set(state => ({
            incoming: state.incoming.filter(u => u.id !== fromId),
        }));
    },

    async cancel(userId, toId) {
        await ServiceLocator.userService.cancelFriendRequest(userId, toId);

        set(state => ({
            outgoing: state.outgoing.filter(u => u.id !== toId),
        }));
    },

    async remove(userId, friendId) {
        await ServiceLocator.userService.removeFriend(userId, friendId);

        set(state => ({
            friends: state.friends.filter(u => u.id !== friendId),
        }));
    },

    getRelation(targetId) {
        const { friends, incoming, outgoing } = get();

        if (friends.some(u => u?.id === targetId)) return "friends";
        if (incoming.some(u => u?.id === targetId)) return "incoming";
        if (outgoing.some(u => u?.id === targetId)) return "outgoing";

        return "none";
    },
}));