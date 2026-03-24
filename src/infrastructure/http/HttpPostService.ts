import type {
    CreatePostPayload,
    PostService,
} from "@/application/post/PostService";
import type { Post } from "@/domain/post/Post";
import type { PostAuthorFilter } from "@/domain/post/PostAuthorFilter";
import type { Comment } from "@/domain/post/Comment";
import { httpRequest } from "./httpClient";
import {
    type ContentPostListRow,
    type FeedItemDto,
    contentPostListRowToCommunityPost,
    feedItemToPost,
} from "./mappers";

type ContentPostRow = ContentPostListRow;

type ContentCommentRow = {
    commentId: string;
    postId: string;
    authorId: string;
    text: string;
    createdAt: string;
};

function contentPostToPost(row: ContentPostRow): Post {
    const created =
        typeof row.createdAt === "string"
            ? row.createdAt
            : (row.createdAt as unknown as Date).toISOString();
    const updated =
        typeof row.updatedAt === "string"
            ? row.updatedAt
            : (row.updatedAt as unknown as Date).toISOString();
    return {
        id: row.postId,
        author: { type: "user", userId: row.authorId },
        content: row.text,
        images: row.media ?? [],
        likes: row.likes ?? [],
        comments: (row.comments ?? []).map((c) => ({
            id: c.id,
            authorId: c.authorId,
            text: c.text,
            createdAt: c.createdAt,
            updatedAt: c.updatedAt,
        })),
        createdAt: created,
        updatedAt: updated,
    };
}

export class HttpPostService implements PostService {
    async getById(id: string): Promise<Post | null> {
        try {
            const row = await httpRequest<ContentPostRow>(`/api/posts/${id}`);
            return contentPostToPost(row);
        } catch {
            return null;
        }
    }

    async getByAuthor(author: PostAuthorFilter): Promise<Post[]> {
        if (author.type === "user") {
            const rows = await httpRequest<ContentPostRow[]>(
                `/api/posts/user/${encodeURIComponent(author.userId)}?limit=50&offset=0`,
            );
            return rows.map(contentPostToPost);
        }
        const rows = await httpRequest<ContentPostRow[]>(
            `/api/posts/user/${encodeURIComponent(author.communityId)}?limit=50&offset=0`,
        );
        return rows.map(row =>
            contentPostListRowToCommunityPost(row, author.communityId),
        );
    }

    async getAll(): Promise<Post[]> {
        const items = await httpRequest<FeedItemDto[]>(
            "/api/feed/me?limit=50&offset=0",
        );
        return items.map(feedItemToPost);
    }

    async create(payload: CreatePostPayload): Promise<Post> {
        const row = await httpRequest<ContentPostRow>("/api/posts", {
            method: "POST",
            body: JSON.stringify({
                text: payload.content,
                media: payload.images ?? [],
                ...(payload.author.type === "community"
                    ? {
                        postAuthorKind: "community",
                        communityId: payload.author.communityId,
                    }
                    : {
                        postAuthorKind: "user",
                    }),
            }),
        });
        if (payload.author.type === "community") {
            const created =
                typeof row.createdAt === "string"
                    ? row.createdAt
                    : (row.createdAt as unknown as Date).toISOString();
            const updated =
                typeof row.updatedAt === "string"
                    ? row.updatedAt
                    : (row.updatedAt as unknown as Date).toISOString();
            return {
                id: row.postId,
                author: {
                    type: "community",
                    communityId: payload.author.communityId,
                    senderUserId: payload.author.senderUserId,
                },
                content: row.text,
                images: row.media ?? [],
                likes: [],
                comments: [],
                createdAt: created,
                updatedAt: updated,
            };
        }
        return contentPostToPost(row);
    }

    async delete(postId: string): Promise<void> {
        await httpRequest(`/api/posts/${encodeURIComponent(postId)}`, {
            method: "DELETE",
        });
    }

    async like(postId: string, _userId: string): Promise<void> {
        await httpRequest(`/api/posts/${encodeURIComponent(postId)}/like`, {
            method: "POST",
        });
    }

    async dislike(postId: string, _userId: string): Promise<void> {
        await httpRequest(`/api/posts/${encodeURIComponent(postId)}/like`, {
            method: "DELETE",
        });
    }

    async addComment(
        postId: string,
        payload: { authorId: string; text: string },
    ): Promise<Comment> {
        const row = await httpRequest<ContentCommentRow>(
            `/api/posts/${encodeURIComponent(postId)}/comments`,
            {
                method: "POST",
                body: JSON.stringify({ text: payload.text }),
            },
        );
        const created =
            typeof row.createdAt === "string"
                ? row.createdAt
                : (row.createdAt as unknown as Date).toISOString();
        return {
            id: row.commentId,
            authorId: row.authorId,
            text: row.text,
            createdAt: created,
            updatedAt: created,
        };
    }
}
