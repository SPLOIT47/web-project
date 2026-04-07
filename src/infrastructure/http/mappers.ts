import type { User } from "@/domain/user/User";
import type { Community } from "@/domain/community/Community";
import type { Post } from "@/domain/post/Post";
import type { PostAuthor } from "@/domain/post/PostAuthor";
import type { Comment } from "@/domain/post/Comment";
import { CommunityTypeId } from "@/domain/community/CommunityTypeId";

export type ApiUserPayload = {
    userId: string;
    login: string;
    email: string;
    createdAt?: string;
};

export type ApiProfile = {
    id: string;
    /** Подмешивается Gateway (BFF) из Auth, не из ProfileService */
    login?: string;
    name: string;
    surname: string;
    bio?: string;
    birthday?: string;
    city?: string;
    education?: string;
    languages?: string[];
    avatarUrl?: string;
    createdAt: string;
    updatedAt: string;
};

export type MeProfileResponse = {
    status: "PENDING" | "READY";
    profile?: ApiProfile;
};

export type FeedItemDto = {
    postId: string;
    authorType: "user" | "community";
    authorId: string;
    createdAt: string;
    payload: {
        text?: string;
        media?: string[];
        likes: string[];
        comments: {
            id: string;
            authorId: string;
            text: string;
            createdAt: string;
            updatedAt: string;
        }[];
    };
};

/** Ответ Content `GET /posts/user/:id` (для сообщества id = communityId). */
export type ContentPostListRow = {
    postId: string;
    authorId: string;
    text: string;
    media: string[];
    likes?: string[];
    comments?: {
        id: string;
        authorId: string;
        text: string;
        createdAt: string;
        updatedAt: string;
    }[];
    createdAt: string;
    updatedAt: string;
};

function normalizeIso(d: string | Date): string {
    return typeof d === "string"
        ? d
        : (d as Date).toISOString();
}

/**
 * Посты от имени сообщества в БД Content хранятся с author_id = communityId.
 * Для стены группы берём их из Content, а не из Feed (там — персональный fan-out).
 */
export function contentPostListRowToCommunityPost(
    row: ContentPostListRow,
    communityId: string,
): Post {
    const created = normalizeIso(row.createdAt);
    const updated = normalizeIso(row.updatedAt);
    return {
        id: row.postId,
        author: {
            type: "community",
            communityId,
            senderUserId: undefined,
        },
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

export function userFromAuthPayload(a: ApiUserPayload): User {
    const now = new Date().toISOString();
    return {
        id: a.userId,
        username: a.login,
        email: a.email,
        name: "",
        surname: "",
        avatarUrl: undefined,
        bio: undefined,
        birthday: undefined,
        city: undefined,
        education: undefined,
        followers: [],
        following: [],
        friends: [],
        communities: [],
        languages: [],
        posts: [],
        chats: [],
        incomingRequests: [],
        outgoingRequests: [],
        createdAt: a.createdAt ?? now,
        updatedAt: a.createdAt ?? now,
    };
}

export function mergeProfile(user: User, p: ApiProfile): User {
    return {
        ...user,
        username: p.login ?? user.username,
        name: p.name,
        surname: p.surname,
        bio: p.bio,
        birthday: p.birthday,
        city: p.city,
        education: p.education,
        languages: p.languages ?? [],
        avatarUrl: p.avatarUrl,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
    };
}

/**
 * Если пришёл {@code login} с Gateway (BFF), используем его; иначе placeholder.
 */
export function mapApiProfileToUser(p: ApiProfile, auth?: ApiUserPayload): User {
    const base = auth
        ? userFromAuthPayload(auth)
        : userFromAuthPayload({
              userId: p.id,
              login:
                  p.login ??
                  `user_${p.id.replace(/-/g, "").slice(0, 12)}`,
              email: "",
          });
    return mergeProfile(base, p);
}

export function feedItemToPost(item: FeedItemDto): Post {
    const author: PostAuthor =
        item.authorType === "user"
            ? { type: "user", userId: item.authorId }
            : {
                  type: "community",
                  communityId: item.authorId,
                  senderUserId: undefined,
              };

    const comments: Comment[] = (item.payload.comments ?? []).map(c => ({
        id: c.id,
        authorId: c.authorId,
        text: c.text,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
    }));

    return {
        id: item.postId,
        author,
        content: item.payload.text ?? "",
        images: item.payload.media ?? [],
        likes: item.payload.likes ?? [],
        comments,
        createdAt: item.createdAt,
        updatedAt: item.createdAt,
    };
}

export type CommunityRow = {
    communityId: string;
    ownerUserId: string;
    name: string;
    type: string;
    category: string;
    description?: string | null;
    avatarUrl?: string | null;
    coverUrl?: string | null;
    createdAt: string | Date;
    updatedAt: string | Date;
};

export type MemberRow = {
    communityId: string;
    userId: string;
    role: string;
};

export function mapCommunityRow(
    row: CommunityRow,
    members: MemberRow[],
): Community {
    const followers = members.map(m => m.userId);
    const admins = members
        .filter(m => m.role === "OWNER" || m.role === "ADMIN")
        .map(m => m.userId);
    const moderators = members
        .filter(m => m.role === "MODERATOR")
        .map(m => m.userId);

    const type =
        row.type === CommunityTypeId.Public
            ? CommunityTypeId.Public
            : (row.type as CommunityTypeId);

    return {
        id: row.communityId,
        ownerUserId: row.ownerUserId,
        name: row.name,
        type,
        category: row.category,
        description: row.description ?? "",
        avatarUrl: row.avatarUrl ?? "",
        coverUrl: row.coverUrl ?? "",
        followers,
        admins,
        moderators,
        posts: [],
        createdAt:
            typeof row.createdAt === "string"
                ? row.createdAt
                : row.createdAt.toISOString(),
        updatedAt:
            typeof row.updatedAt === "string"
                ? row.updatedAt
                : row.updatedAt.toISOString(),
    };
}
