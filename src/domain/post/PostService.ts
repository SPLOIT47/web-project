import type { Post } from "./Post";

export interface PostService {
    getById(id: string): Promise<Post | null>;
    getByAuthor(authorId: string): Promise<Post[]>;
    getAll(): Promise<Post[]>;
    create(authorId: string, content: string, images?: string[]): Promise<Post>;
    delete(postId: string): Promise<boolean>;
    like(postId: string, userId: string): Promise<void>;
    dislike(postId: string, userId: string): Promise<void>;
}