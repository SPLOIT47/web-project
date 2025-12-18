import type { CommunityService } from "@/application/community/CommunityService";
import type { Community } from "@/domain/community/Community";
import type { Post } from "@/domain/post/Post";
import type { CreateCommunityPayload } from "@/domain/community/CreateCommunityPayload";

import { faker } from "@faker-js/faker";
import { loadDb, saveDb } from "./database";
import { mockResponse } from "./mockApi";

export class MockCommunityService implements CommunityService {

    async getById(id: string): Promise<Community | null> {
        const db = loadDb();

        return mockResponse(
            db.communities.find(c => c.id === id) ?? null
        );
    }

    async getAll(): Promise<Community[]> {
        const db = loadDb();
        return mockResponse(db.communities);
    }

    async getPosts(communityId: string): Promise<Post[]> {
        const db = loadDb();

        const community = db.communities.find(
            c => c.id === communityId
        );

        if (!community) return mockResponse([]);

        return mockResponse(
            db.posts.filter(p =>
                community.posts.includes(p.id)
            )
        );
    }

    async create(
        data: CreateCommunityPayload,
        creatorId: string
    ): Promise<Community> {
        const db = loadDb();

        const community: Community = {
            id: faker.string.uuid(),

            name: data.name,
            type: data.type,
            category: data.category,
            description: data.description ?? "",

            avatarUrl: data.avatarUrl ?? "",
            coverUrl: data.coverUrl ?? "",

            followers: [creatorId],
            admins: [creatorId],
            moderators: [],
            posts: [],

            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        db.communities.push(community);
        saveDb(db);

        return mockResponse(community);
    }

    async follow(
        communityId: string,
        userId: string
    ): Promise<void> {
        const db = loadDb();

        const c = db.communities.find(
            c => c.id === communityId
        );
        if (!c) return mockResponse(undefined);

        if (!c.followers.includes(userId)) {
            c.followers.push(userId);
            saveDb(db);
        }

        return mockResponse(undefined);
    }

    async unfollow(
        communityId: string,
        userId: string
    ): Promise<void> {
        const db = loadDb();

        const c = db.communities.find(
            c => c.id === communityId
        );
        if (!c) return mockResponse(undefined);

        c.followers = c.followers.filter(
            (id: string) => id !== userId
        );

        saveDb(db);
        return mockResponse(undefined);
    }

    async update(
        communityId: string,
        data: Partial<Omit<Community, "id" | "createdAt">>
    ): Promise<Community | null> {
        const db = loadDb();

        const c = db.communities.find(
            c => c.id === communityId
        );
        if (!c) return mockResponse(null);

        Object.assign(c, data);
        c.updatedAt = new Date().toISOString();

        saveDb(db);
        return mockResponse(c);
    }

    async delete(id: string): Promise<void> {
        const db = loadDb();

        db.communities = db.communities.filter(
            c => c.id !== id
        );

        saveDb(db);
        return mockResponse(undefined);
    }
}