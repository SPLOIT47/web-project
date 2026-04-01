import { create } from "zustand";
import { ServiceLocator } from "@/application/ServiceLocator";
import { useUserStore } from "@/store/userStore";
import { isUuidString } from "@/utils/uuid";

import type { Community } from "@/domain/community/Community";
import type { PostWithAuthor } from "@/presentation/post/PostWithAuthor";
import type { Post } from "@/domain/post/Post";

interface CommunityPageState {
    community: Community | null;
    posts: PostWithAuthor[];
    loading: boolean;

    showDetails: boolean;

    load: (id: string) => Promise<void>;
    follow: (communityId: string, userId: string) => Promise<void>;
    unfollow: (communityId: string, userId: string) => Promise<void>;
    deleteCommunity: (communityId: string) => Promise<void>;
    removePost: (postId: string) => void;

    openDetails: () => void;
    closeDetails: () => void;
}

export const useCommunityPageStore = create<CommunityPageState>((set) => ({
    community: null,
    posts: [],
    loading: false,
    showDetails: false,

    openDetails: () => set({ showDetails: true }),
    closeDetails: () => set({ showDetails: false }),

    removePost: postId =>
        set(state => ({
            posts: state.posts.filter(p => p.post.id !== postId),
        })),

    load: async (communityId: string) => {
        set({ loading: true });

        const communityService = ServiceLocator.communityService;
        const userService = ServiceLocator.userService;

        const community = await communityService.getById(communityId);
        if (!community) {
            set({ loading: false });
            return;
        }

        const posts: Post[] =
            await communityService.getPosts(communityId);

        const userIds = new Set<string>();
        for (const p of posts) {
            if (p.author.type === "user") {
                if (isUuidString(p.author.userId)) {
                    userIds.add(p.author.userId);
                }
            } else {
                if (p.author.senderUserId && isUuidString(p.author.senderUserId)) {
                    userIds.add(p.author.senderUserId);
                }
            }
            for (const c of p.comments) {
                if (isUuidString(c.authorId)) {
                    userIds.add(c.authorId);
                }
            }
        }

        const users = await userService.getBatch([...userIds]);
        if (users.length > 0) {
            useUserStore.getState().upsertMany(users);
        }
        const userMap = new Map(users.map(u => [u.id, u]));

        const postsWithAuthors: PostWithAuthor[] = posts.map(post => {
            const author = post.author;

            switch (author.type) {
                case "user": {
                    const user = userMap.get(author.userId);
                    if (!user) {
                        throw new Error(`User not found for post ${post.id}`);
                    }

                    return {
                        post,
                        author: {
                            type: "user",
                            user,
                        },
                    };
                }

                case "community": {
                    const senderUser = author.senderUserId
                        ? userMap.get(author.senderUserId)
                        : undefined;

                    return {
                        post,
                        author: {
                            type: "community",
                            community,
                            senderUser,
                        },
                    };
                }

                default: {
                    const _never: never = author;
                    throw new Error("Unknown author type");
                }
            }
        });

        set({
            community,
            posts: postsWithAuthors,
            loading: false,
        });
    },

    follow: async (communityId, userId) => {
        await ServiceLocator.communityService.follow(
            communityId,
            userId
        );

        set(state =>
            state.community
                ? {
                    community: {
                        ...state.community,
                        followers: [
                            ...state.community.followers,
                            userId,
                        ],
                    },
                }
                : {}
        );
    },

    unfollow: async (communityId, userId) => {
        await ServiceLocator.communityService.unfollow(
            communityId,
            userId
        );

        set(state =>
            state.community
                ? {
                    community: {
                        ...state.community,
                        followers:
                            state.community.followers.filter(
                                id => id !== userId
                            ),
                    },
                }
                : {}
        );
    },

    deleteCommunity: async (communityId) => {
        await ServiceLocator.communityService.delete(communityId);
    },
}));