import { create } from "zustand";
import { ServiceLocator } from "@/application/ServiceLocator";
import type { Chat } from "@/domain/chat/Chat";

interface ChatState {
    chats: Chat[];
    loadChats: () => Promise<void>;
}

export const useChatStore = create<ChatState>((set) => ({
    chats: [],

    loadChats: async () => {
        const data = await ServiceLocator.chatService.getChats();
        set({ chats: data });
    },
}));