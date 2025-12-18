import type {
    CreatePostPayload,
    PostService,
} from "@/application/post/PostService";

import type { Post } from "@/domain/post/Post";
import type { PostAuthorFilter } from "@/domain/post/PostAuthorFilter";

import { faker } from "@faker-js/faker";
import { mockResponse } from "./mockApi";
import { loadDb, saveDb } from "./database";

export class MockPostService implements PostService {
    async getById(id: string): Promise<Post | null> {
        const db = loadDb();

        return mockResponse(
            db.posts.find(p => p.id === id) ?? null
        );
    }

    async getByAuthor(
        author: PostAuthorFilter
    ): Promise<Post[]> {
        const db = loadDb();

        const filtered = db.posts.filter(post => {
            if (author.type === "user") {
                return (
                    post.author.type === "user" &&
                    post.author.userId === author.userId
                );
            }

            return (
                post.author.type === "community" &&
                post.author.communityId === author.communityId
            );
        });

        return mockResponse(
            filtered.sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
            )
        );
    }

    async getAll(): Promise<Post[]> {
        const db = loadDb();

        return mockResponse(
            [...db.posts].sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
            )
        );
    }

    async create(
        payload: CreatePostPayload
    ): Promise<Post> {
        const db = loadDb();
        const now = new Date().toISOString();

        const post: Post = {
            id: faker.string.uuid(),
            author: payload.author,
            content: payload.content,
            images: payload.images ?? [],
            likes: [],
            comments: [],
            createdAt: now,
            updatedAt: now,
        };

        db.posts.unshift(post);

        if (post.author.type === "community") {
            const { communityId } = post.author;

            const c = db.communities.find(
                c => c.id === communityId
            );

            c?.posts.unshift(post.id);
        }

        saveDb(db);
        return mockResponse(post);
    }

    async delete(postId: string): Promise<void> {
        const db = loadDb();

        db.posts = db.posts.filter(p => p.id !== postId);

        for (const c of db.communities) {
            c.posts = c.posts.filter((id: string) => id !== postId);
        }

        saveDb(db);
        return mockResponse(undefined);
    }

    async like(postId: string, userId: string): Promise<void> {
        const db = loadDb();
        const post = db.posts.find(p => p.id === postId);
        if (!post) return mockResponse(undefined);

        if (!post.likes.includes(userId)) {
            post.likes.push(userId);
            post.updatedAt = new Date().toISOString();
            saveDb(db);
        }

        return mockResponse(undefined);
    }

    async dislike(postId: string, userId: string): Promise<void> {
        const db = loadDb();
        const post = db.posts.find(p => p.id === postId);
        if (!post) return mockResponse(undefined);

        if (post.likes.includes(userId)) {
            post.likes = post.likes.filter((id: string) => id !== userId);
            post.updatedAt = new Date().toISOString();
            saveDb(db);
        }

        return mockResponse(undefined);
    }

    async addComment(
        postId: string,
        payload: { authorId: string; text: string }
    ): Promise<void> {
        const db = loadDb();
        const post = db.posts.find(p => p.id === postId);
        if (!post) return mockResponse(undefined);

        const now = new Date().toISOString();

        post.comments.push({
            id: crypto.randomUUID(),
            authorId: payload.authorId,
            text: payload.text,
            createdAt: now,
            updatedAt: now,
        });

        post.updatedAt = now;
        saveDb(db);

        return mockResponse(undefined);
    }
}