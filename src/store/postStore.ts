import { create } from "zustand";
import { ServiceLocator } from "@/application/ServiceLocator";

import type { Post } from "@/domain/post/Post";
import type { PostAuthor } from "@/domain/post/PostAuthor";
import type { Comment } from "@/domain/post/Comment";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";
import { useCommunityStore } from "@/store/communityStore";
import { isUuidString } from "@/utils/uuid";
import { HttpError } from "@/infrastructure/http/httpClient";

interface PostState {
    allPosts: Post[];
    loading: boolean;
    error: string | null;

    loadFeed: () => Promise<void>;

    createPost: (
        author: PostAuthor,
        content: string,
        images?: string[]
    ) => Promise<void>;

    toggleLike: (postId: string, currentlyLiked: boolean) => Promise<void>;
    addComment: (postId: string, text: string) => Promise<Comment>;
    deletePost: (postId: string) => Promise<void>;
    clear: () => void;
}

export const usePostStore = create<PostState>((set, get) => ({
    allPosts: [],
    loading: false,
    error: null,

    loadFeed: async () => {
        set({ loading: true, error: null });

        try {
            // Только лента Feed (/api/feed/me). Раньше при пустом ответе подставлялись только свои посты
            // из Content — это маскировало пустую ленту и выглядело как «нет постов друзей».
            const posts = await ServiceLocator.postService.getAll();
            const me = useAuthStore.getState().user;

            const userIds = new Set<string>();
            for (const p of posts) {
                if (
                    p.author.type === "user" &&
                    isUuidString(p.author.userId)
                ) {
                    userIds.add(p.author.userId);
                }
                for (const c of p.comments) {
                    if (isUuidString(c.authorId)) {
                        userIds.add(c.authorId);
                    }
                }
            }
            if (me && isUuidString(me.id)) {
                userIds.add(me.id);
            }

            if (userIds.size > 0) {
                if (import.meta.env.DEV) {
                    console.debug("[loadFeed] author/comment userIds", [...userIds]);
                }
                const users = await ServiceLocator.userService.getBatch([
                    ...userIds,
                ]);
                if (users.length > 0) {
                    useUserStore.getState().upsertMany(users);
                }
            }

            const communityIds = [
                ...new Set(
                    posts
                        .filter(
                            (p): p is Post & {
                                author: {
                                    type: "community";
                                    communityId: string;
                                };
                            } => p.author.type === "community",
                        )
                        .map(p => p.author.communityId)
                        .filter(isUuidString),
                ),
            ];
            if (communityIds.length > 0) {
                const loaded = await Promise.all(
                    communityIds.map(id =>
                        ServiceLocator.communityService.getById(id),
                    ),
                );
                const communities = loaded.filter(
                    (c): c is NonNullable<typeof c> => c != null,
                );
                if (communities.length > 0) {
                    useCommunityStore.getState().upsertMany(communities);
                }
            }

            set({ allPosts: posts, loading: false });
        } catch {
            set({ error: "Failed to load feed", loading: false });
        }
    },

    createPost: async (
        author,
        content,
        images = []
    ) => {
        set({ loading: true, error: null });

        try {
            const post =
                await ServiceLocator.postService.create({
                    author,
                    content,
                    images,
                });

            const me = useAuthStore.getState().user;
            if (me) {
                useUserStore.getState().upsertMany([me]);
            }

            set(state => ({
                allPosts: [post, ...state.allPosts],
                loading: false,
            }));
        } catch (e) {
            if (import.meta.env.DEV) {
                if (e instanceof HttpError) {
                    console.error(
                        "[createPost]",
                        e.status,
                        e.message,
                        e.body,
                    );
                } else {
                    console.error("[createPost]", e);
                }
            }
            set({ error: "Failed to create post", loading: false });
            throw e;
        }
    },

    /**
     * @param currentlyLiked — было ли уже лайкнуто текущим пользователем (из UI поста)
     */
    toggleLike: async (postId: string, currentlyLiked: boolean) => {
        const me = useAuthStore.getState().user;
        if (!me) return;

        const revert = () =>
            set(state => ({
                allPosts: state.allPosts.map(p =>
                    p.id === postId
                        ? {
                            ...p,
                            likes: currentlyLiked
                                ? [...p.likes, me.id]
                                : p.likes.filter(id => id !== me.id),
                        }
                        : p
                ),
            }));

        set(state => ({
            allPosts: state.allPosts.map(p =>
                p.id === postId
                    ? {
                        ...p,
                        likes: currentlyLiked
                            ? p.likes.filter(id => id !== me.id)
                            : [...p.likes, me.id],
                    }
                    : p
            ),
        }));

        try {
            if (currentlyLiked) {
                await ServiceLocator.postService.dislike(postId, me.id);
            } else {
                await ServiceLocator.postService.like(postId, me.id);
            }
        } catch {
            revert();
            throw new Error("Like request failed");
        }
    },

    addComment: async (postId, text) => {
        const me = useAuthStore.getState().user;
        if (!me || !text.trim()) {
            throw new Error("Not authenticated or empty comment");
        }

        const saved = await ServiceLocator.postService.addComment(postId, {
            authorId: me.id,
            text: text.trim(),
        });

        set(state => ({
            allPosts: state.allPosts.map(p =>
                p.id === postId
                    ? {
                        ...p,
                        comments: [...p.comments, saved],
                    }
                    : p
            ),
        }));

        return saved;
    },

    deletePost: async postId => {
        await ServiceLocator.postService.delete(postId);
        set(state => ({
            allPosts: state.allPosts.filter(p => p.id !== postId),
        }));
    },

    clear: () => {
        set({ allPosts: [], loading: false, error: null });
    },
}));