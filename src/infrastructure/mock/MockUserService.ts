import type { UserService } from "@/application/user/UserService";
import type { User } from "@/domain/user/User";
import type { EditProfilePayload } from "@/domain/user/EditProfilePayload";

import { loadDb, saveDb } from "./database";
import { mockResponse } from "./mockApi";

export class MockUserService implements UserService {
    async getById(id: string): Promise<User | null> {
        const db = loadDb();
        return mockResponse(
            db.users.find(u => u.id === id) ?? null
        );
    }

    async getAll(): Promise<User[]> {
        const db = loadDb();
        return mockResponse(db.users);
    }

    async search(query: string): Promise<User[]> {
        const q = query.trim().toLowerCase();
        if (!q) return mockResponse([]);

        const db = loadDb();

        return mockResponse(
            db.users.filter(u =>
                u.username.toLowerCase().includes(q) ||
                u.name?.toLowerCase().includes(q) ||
                u.surname?.toLowerCase().includes(q)
            )
        );
    }

    async follow(userId: string, targetId: string): Promise<void> {
        const db = loadDb();

        const me = db.users.find(u => u.id === userId);
        const target = db.users.find(u => u.id === targetId);
        if (!me || !target) return mockResponse(undefined);

        me.following ??= [];
        if (!me.following.includes(targetId)) {
            me.following.push(targetId);
        }

        if (!target.followers.includes(userId)) {
            target.followers.push(userId);
        }

        saveDb(db);
        return mockResponse(undefined);
    }

    async unfollow(userId: string, targetId: string): Promise<void> {
        const db = loadDb();

        const me = db.users.find(u => u.id === userId);
        const target = db.users.find(u => u.id === targetId);
        if (!me || !target) return mockResponse(undefined);

        me.following =
            (me.following ?? []).filter((id: string) => id !== targetId);

        target.followers =
            target.followers.filter((id: string) => id !== userId);

        saveDb(db);
        return mockResponse(undefined);
    }

    async updateProfile(
        id: string,
        data: EditProfilePayload
    ): Promise<User> {
        const db = loadDb();

        const idx = db.users.findIndex(u => u.id === id);
        if (idx === -1) {
            throw new Error("User not found");
        }

        const updated: User = {
            ...db.users[idx],
            ...data,
            updatedAt: new Date().toISOString(),
        };

        db.users[idx] = updated;
        saveDb(db);

        return mockResponse(updated);
    }

    async getFriends(userId: string): Promise<User[]> {
        const db = loadDb();
        const user = db.users.find(u => u.id === userId);
        if (!user) return mockResponse([]);

        return mockResponse(
            db.users.filter(u => user.friends.includes(u.id))
        );
    }

    async getIncomingRequests(userId: string): Promise<User[]> {
        const db = loadDb();
        const user = db.users.find(u => u.id === userId);
        if (!user) return mockResponse([]);

        return mockResponse(
            db.users.filter(u =>
                user.incomingRequests.includes(u.id)
            )
        );
    }

    async getOutgoingRequests(userId: string): Promise<User[]> {
        const db = loadDb();
        const user = db.users.find(u => u.id === userId);
        if (!user) return mockResponse([]);

        return mockResponse(
            db.users.filter(u =>
                user.outgoingRequests.includes(u.id)
            )
        );
    }

    async sendFriendRequest(
        fromId: string,
        toId: string
    ): Promise<void> {
        const db = loadDb();

        const from = db.users.find(u => u.id === fromId);
        const to = db.users.find(u => u.id === toId);
        if (!from || !to) return mockResponse(undefined);

        if (!from.outgoingRequests.includes(toId)) {
            from.outgoingRequests.push(toId);
        }

        if (!to.incomingRequests.includes(fromId)) {
            to.incomingRequests.push(fromId);
        }

        saveDb(db);
        return mockResponse(undefined);
    }

    async acceptFriendRequest(
        userId: string,
        fromId: string
    ): Promise<void> {
        const db = loadDb();

        const user = db.users.find(u => u.id === userId);
        const from = db.users.find(u => u.id === fromId);
        if (!user || !from) return mockResponse(undefined);

        user.incomingRequests =
            user.incomingRequests.filter((id: string) => id !== fromId);

        from.outgoingRequests =
            from.outgoingRequests.filter((id: string) => id !== userId);

        if (!user.friends.includes(fromId)) {
            user.friends.push(fromId);
        }

        if (!from.friends.includes(userId)) {
            from.friends.push(userId);
        }

        saveDb(db);
        return mockResponse(undefined);
    }

    async declineFriendRequest(
        userId: string,
        fromId: string
    ): Promise<void> {
        const db = loadDb();

        const user = db.users.find(u => u.id === userId);
        const from = db.users.find(u => u.id === fromId);
        if (!user || !from) return mockResponse(undefined);

        user.incomingRequests =
            user.incomingRequests.filter((id: string) => id !== fromId);

        from.outgoingRequests =
            from.outgoingRequests.filter((id: string) => id !== userId);

        saveDb(db);
        return mockResponse(undefined);
    }

    async cancelFriendRequest(
        fromId: string,
        toId: string
    ): Promise<void> {
        return this.declineFriendRequest(toId, fromId);
    }

    async removeFriend(
        userId: string,
        friendId: string
    ): Promise<void> {
        const db = loadDb();

        const user = db.users.find(u => u.id === userId);
        const friend = db.users.find(u => u.id === friendId);
        if (!user || !friend) return mockResponse(undefined);

        user.friends =
            user.friends.filter((id: string) => id !== friendId);

        friend.friends =
            friend.friends.filter((id: string) => id !== userId);

        saveDb(db);
        return mockResponse(undefined);
    }
}