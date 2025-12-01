import type { CommunityService } from "@/domain/community/CommunityService";
import type { Community } from "@/domain/community/Community";
import type { Post } from "@/domain/post/Post";
import { db } from "./database";
import { faker } from "@faker-js/faker";
import { mockResponse } from "./mockApi";

export class MockCommunityService implements CommunityService {
    async getById(id: string): Promise<Community | null> {
        return mockResponse(db.communities.find(c => c.id === id) || null);
    }

    async getAll(): Promise<Community[]> {
        return mockResponse(db.communities);
    }

    async getPosts(id: string): Promise<Post[]> {
        const c = db.communities.find(c => c.id === id);
        if (!c) return mockResponse([]);
        return mockResponse(db.posts.filter(p => c.posts.includes(p.id)));
    }

    async create(data: Partial<Community>): Promise<Community> {
        const c: Community = {
            id: faker.string.uuid(),
            name: data.name ?? "New Community",
            avatarUrl: data.avatarUrl ?? faker.image.avatar(),
            coverUrl: data.coverUrl ?? faker.image.urlPicsumPhotos(),
            description: data.description ?? "",
            category: data.category ?? "Other",
            type: data.type ?? "public",

            followers: [],
            admins: data.admins ?? [],
            moderators: [],

            posts: [],

            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        db.communities.push(c);
        return mockResponse(c);
    }

    async follow(communityId: string, userId: string): Promise<void> {
        const c = db.communities.find(c => c.id === communityId);
        if (c && !c.followers.includes(userId)) c.followers.push(userId);
        return mockResponse(undefined);
    }

    async unfollow(communityId: string, userId: string): Promise<void> {
        const c = db.communities.find(c => c.id === communityId);
        if (c) c.followers = c.followers.filter(id => id !== userId);
        return mockResponse(undefined);
    }

    async update(communityId: string, data: Partial<Community>): Promise<Community | null> {
        const c = db.communities.find(c => c.id === communityId);
        if (!c) return mockResponse(null);

        Object.assign(c, data);
        c.updatedAt = new Date().toISOString();

        return mockResponse(c);
    }
}