import type { Post } from "@/domain/post/Post";
import type { PostAuthor } from "@/domain/post/PostAuthor";
import {PostAuthorFilter} from "@/domain/post/PostAuthorFilter";

export interface CreatePostPayload {
    author: PostAuthor;
    content: string;
    images?: string[];
}

export interface PostService {
    getById(id: string): Promise<Post | null>;

    getByAuthor(author: PostAuthorFilter): Promise<Post[]>;

    getAll(): Promise<Post[]>;

    create(payload: CreatePostPayload): Promise<Post>;

    delete(postId: string): Promise<void>;

    like(postId: string, userId: string): Promise<void>;
    dislike(postId: string, userId: string): Promise<void>;

    addComment(
        postId: string,
        payload: {
            authorId: string;
            text: string;
        }
    ): Promise<void>;
}