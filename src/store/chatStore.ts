import { create } from "zustand";
import { ServiceLocator } from "@/application/ServiceLocator";
import { useAuthStore } from "@/store/authStore";

import type { Chat } from "@/domain/chat/Chat";
import type { CreateChatPayload } from "@/domain/chat/CreateChatPayload";

interface ChatState {
    userChats: Chat[];
    communityChats: Chat[];

    activeChatId: string | null;
    messages: Record<string, Message[]>;

    loadUserChats: () => Promise<void>;
    loadCommunityChats: (communityId: string) => Promise<void>;

    openChat: (chatId: string) => Promise<void>;
    openCommunityChat: (
        communityId: string,
        userId: string
    ) => Promise<void>;

    sendMessage: (
        chatId: string,
        author: MessageAuthor,
        text: string
    ) => Promise<void>;

    createChat: (payload: CreateChatPayload) => Promise<void>;
    deleteChat: (chatId: string) => Promise<void>;

    clearActiveChat: () => void;
    openOrCreatePrivateChat: (userId: string) => Promise<void>;
    refreshMessages: (chatId: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
    userChats: [],
    communityChats: [],
    activeChatId: null,
    messages: {},

    async loadUserChats() {
        const me = useAuthStore.getState().user;
        if (!me) return;

        const chats =
            await ServiceLocator.chatService.getMyChats(me.id);

        set({ userChats: chats });
    },

    async loadCommunityChats(communityId) {
        const chats =
            await ServiceLocator.chatService.getCommunityChats(
                communityId
            );

        set({ communityChats: chats });
    },

    async openChat(chatId) {
        const messages =
            await ServiceLocator.chatService.getMessages(chatId);

        set(state => ({
            activeChatId: chatId,
            messages: {
                ...state.messages,
                [chatId]: messages,
            },
        }));
    },

    async openCommunityChat(communityId, userId) {
        const chat =
            await ServiceLocator.chatService.getOrCreateCommunityChat(
                communityId,
                userId
            );

        const messages =
            await ServiceLocator.chatService.getMessages(chat.id);

        set(state => ({
            activeChatId: chat.id,
            messages: {
                ...state.messages,
                [chat.id]: messages,
            },
        }));
    },

    async sendMessage(chatId, author, text) {
        const message =
            await ServiceLocator.chatService.sendMessage(
                chatId,
                author,
                { text }
            );

        set(state => ({
            messages: {
                ...state.messages,
                [chatId]: [
                    ...(state.messages[chatId] ?? []),
                    message,
                ],
            },
            userChats: state.userChats.map(c =>
                c.id === chatId
                    ? { ...c, lastMessage: message }
                    : c
            ),
            communityChats: state.communityChats.map(c =>
                c.id === chatId
                    ? { ...c, lastMessage: message }
                    : c
            ),
        }));

        const state = get();

        const exists =
            state.userChats.some(c => c.id === chatId) ||
            state.communityChats.some(c => c.id === chatId);

        if (!exists) {
            await state.loadUserChats();
        }
    },

    async createChat(payload) {
        const chat =
            await ServiceLocator.chatService.createChat(payload);

        set(state => ({
            userChats: [chat, ...state.userChats],
            activeChatId: chat.id,
        }));
    },

    async deleteChat(chatId) {
        await ServiceLocator.chatService.deleteChat(chatId);

        set(state => ({
            userChats: state.userChats.filter(c => c.id !== chatId),
            communityChats: state.communityChats.filter(
                c => c.id !== chatId
            ),
            activeChatId:
                state.activeChatId === chatId
                    ? null
                    : state.activeChatId,
        }));
    },

    clearActiveChat() {
        set({ activeChatId: null });
    },

    openOrCreatePrivateChat: async (otherUserId) => {
        const me = useAuthStore.getState().user;
        if (!me) return;

        const existing = get().userChats.find(
            c =>
                c.type === "private" &&
                c.members.includes(me.id) &&
                c.members.includes(otherUserId)
        );

        if (existing) {
            await get().openChat(existing.id);
            return;
        }

        const chat =
            await ServiceLocator.chatService.createChat({
                type: "private",
                members: [me.id, otherUserId],
            });

        set(state => ({
            userChats: [chat, ...state.userChats],
            activeChatId: chat.id,
        }));

        const messages =
            await ServiceLocator.chatService.getMessages(chat.id);

        set(state => ({
            messages: {
                ...state.messages,
                [chat.id]: messages,
            },
        }));
    },

    refreshMessages: async (chatId) => {
        const messages =
            await ServiceLocator.chatService.getMessages(chatId);

        set(state => ({
            messages: {
                ...state.messages,
                [chatId]: messages,
            },
        }));
    },
}));