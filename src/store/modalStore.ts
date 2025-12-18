import { create } from "zustand";
import type { User } from "@/domain/user/User";

export type AddPostAuthor =
    | {
    type: "user";
    id: string;
}
    | {
    type: "community";
    id: string;
    senderUserId: string;
};

type ModalState =
    | { type: null }

    | { type: "communityDetails"; communityId: string }
    | { type: "communityFollowers"; userIds: string[] }
    | { type: "confirmDeleteCommunity"; communityId: string }

    | {
    type: "addPost";
    author: AddPostAuthor;
}
    | { type: "editProfile"; user: User }

    | { type: "createChat" }
    | { type: "chatInfo"; chatId: string };

type ModalStore = {
    modal: ModalState;

    openCommunityDetails: (id: string) => void;
    openCommunityFollowers: (ids: string[]) => void;
    openConfirmDeleteCommunity: (id: string) => void;

    openAddPost: (author: AddPostAuthor) => void;

    openEditProfile: (user: User) => void;

    openCreateChat: () => void;
    openChatInfo: (chatId: string) => void;

    close: () => void;
};

export const useModalStore = create<ModalStore>(set => ({
    modal: { type: null },


    openCommunityDetails: communityId =>
        set({
            modal: { type: "communityDetails", communityId },
        }),

    openCommunityFollowers: userIds =>
        set({
            modal: { type: "communityFollowers", userIds },
        }),

    openConfirmDeleteCommunity: communityId =>
        set({
            modal: { type: "confirmDeleteCommunity", communityId },
        }),

    openAddPost: author =>
        set({
            modal: {
                type: "addPost",
                author,
            },
        }),

    openEditProfile: user =>
        set({
            modal: { type: "editProfile", user },
        }),

    openCreateChat: () =>
        set({
            modal: { type: "createChat" },
        }),

    openChatInfo: chatId =>
        set({
            modal: { type: "chatInfo", chatId },
        }),

    close: () => set({ modal: { type: null } }),
}));