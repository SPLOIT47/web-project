import { create } from "zustand";
import { ServiceLocator } from "@/application/ServiceLocator";
import type { Post } from "@/domain/post/Post";

interface PostState {
    posts: Post[];
    loadFeed: () => Promise<void>;
}

export const usePostStore = create<PostState>((set) => ({
    posts: [],

    loadFeed: async () => {
        const feed = await ServiceLocator.postService.getFeed();
        set({ posts: feed });
    },
}));