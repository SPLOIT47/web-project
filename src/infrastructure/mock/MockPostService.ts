import type { PostService } from "@/domain/post/PostService";
import type { Post } from "@/domain/post/Post";
import { db } from "./database";
import { mockResponse } from "./mockApi";
import { faker } from "@faker-js/faker";

export class MockPostService implements PostService {
    async getById(id: string): Promise<Post | null> {
        return mockResponse(db.posts.find(p => p.id === id) || null);
    }

    async getByAuthor(authorId: string): Promise<Post[]> {
        return mockResponse(db.posts.filter(p => p.authorId === authorId));
    }

    async getAll(): Promise<Post[]> {
        const sorted = [...db.posts].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        return mockResponse(sorted);
    }

    async create(authorId: string, content: string, images: string[] = []): Promise<Post> {
        const post: Post = {
            id: faker.string.uuid(),
            authorId,
            content,
            images,
            likes: [],
            comments: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        db.posts.unshift(post);
        return mockResponse(post);
    }

    async delete(postId: string): Promise<boolean> {
        const idx = db.posts.findIndex(p => p.id === postId);
        if (idx === -1) return mockResponse(false);
        db.posts.splice(idx, 1);
        return mockResponse(true);
    }

    async like(postId: string, userId: string): Promise<void> {
        const post = db.posts.find(p => p.id === postId);
        if (post && !post.likes.includes(userId)) post.likes.push(userId);
        return mockResponse(undefined);
    }

    async dislike(postId: string, userId: string): Promise<void> {
        const post = db.posts.find(p => p.id === postId);
        if (post) post.likes = post.likes.filter(id => id !== userId);
        return mockResponse(undefined);
    }
}