import type { UserService } from "@/domain/user/UserService";
import type { User } from "@/domain/user/User";
import { db } from "./database";
import { mockResponse } from "./mockApi";

export class MockUserService implements UserService {
    async getById(id: string): Promise<User | null> {
        return mockResponse(db.users.find(u => u.id === id) || null);
    }

    async getAll(): Promise<User[]> {
        return mockResponse(db.users);
    }

    async follow(userId: string, targetId: string): Promise<void> {
        const me = db.users.find(u => u.id === userId);
        const target = db.users.find(u => u.id === targetId);
        if (!me || !target) return mockResponse(undefined);

        if (!me.following?.includes(targetId)) {
            me.following = [...(me.following || []), targetId];
        }
        if (!target.followers.includes(userId)) {
            target.followers.push(userId);
        }

        return mockResponse(undefined);
    }

    async unfollow(userId: string, targetId: string): Promise<void> {
        const me = db.users.find(u => u.id === userId);
        const target = db.users.find(u => u.id === targetId);
        if (!me || !target) return mockResponse(undefined);

        me.following = (me.following || []).filter(id => id !== targetId);
        target.followers = target.followers.filter(id => id !== userId);

        return mockResponse(undefined);
    }
}