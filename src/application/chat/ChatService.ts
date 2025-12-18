import type { Chat } from "@/domain/chat/Chat";
import type { CreateChatPayload } from "@/domain/chat/CreateChatPayload";
import type { SendMessagePayload } from "@/domain/chat/SendMessagePayload";

export interface ChatService {
    getMyChats(userId: string): Promise<Chat[]>;
    getCommunityChats(communityId: string): Promise<Chat[]>;

    getOrCreateCommunityChat(
        communityId: string,
        userId: string
    ): Promise<Chat>;

    createChat(payload: CreateChatPayload): Promise<Chat>;
    deleteChat(chatId: string): Promise<void>;

    getMessages(chatId: string): Promise<Message[]>;
    sendMessage(
        chatId: string,
        author: Message["author"],
        payload: SendMessagePayload
    ): Promise<Message>;
}