import { create } from "zustand";
import { ServiceLocator } from "@/application/ServiceLocator";

import type { Post } from "@/domain/post/Post";
import type { PostAuthor } from "@/domain/post/PostAuthor";
import { useAuthStore } from "@/store/authStore";

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

    toggleLike: (postId: string) => Promise<void>;
    addComment: (postId: string, text: string) => Promise<void>;
    clear: () => void;
}

export const usePostStore = create<PostState>((set, get) => ({
    allPosts: [],
    loading: false,
    error: null,

    loadFeed: async () => {
        set({ loading: true, error: null });

        try {
            const posts = await ServiceLocator.postService.getAll();
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

            set(state => ({
                allPosts: [post, ...state.allPosts],
                loading: false,
            }));
        } catch {
            set({ error: "Failed to create post", loading: false });
        }
    },

    toggleLike: async postId => {
        const me = useAuthStore.getState().user;
        if (!me) return;

        const post = get().allPosts.find(p => p.id === postId);
        if (!post) return;

        const isLiked = post.likes.includes(me.id);

        set(state => ({
            allPosts: state.allPosts.map(p =>
                p.id === postId
                    ? {
                        ...p,
                        likes: isLiked
                            ? p.likes.filter(id => id !== me.id)
                            : [...p.likes, me.id],
                    }
                    : p
            ),
        }));

        if (isLiked) {
            await ServiceLocator.postService.dislike(postId, me.id);
        } else {
            await ServiceLocator.postService.like(postId, me.id);
        }
    },

    addComment: async (postId, text) => {
        const me = useAuthStore.getState().user;
        if (!me || !text.trim()) return;

        const now = new Date().toISOString();

        const comment = {
            id: crypto.randomUUID(),
            authorId: me.id,
            text,
            createdAt: now,
            updatedAt: now,
        };

        set(state => ({
            allPosts: state.allPosts.map(p =>
                p.id === postId
                    ? {
                        ...p,
                        comments: [...p.comments, comment],
                    }
                    : p
            ),
        }));

        await ServiceLocator.postService.addComment(postId, {
            authorId: me.id,
            text,
        });
    },

    clear: () => {
        set({ allPosts: [], loading: false, error: null });
    },
}));