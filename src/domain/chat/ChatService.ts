import type { Chat } from "./Chat";
import type { Message, MessageStatus } from "./Message";

export interface ChatService {
    getById(id: string): Promise<Chat | null>;
    getByUser(userId: string): Promise<Chat[]>;
    create(userA: string, userB: string): Promise<Chat>;
    getMessages(chatId: string): Promise<Message[]>;
    sendMessage(chatId: string, senderId: string, text: string): Promise<Message>;
    updateMessageStatus(messageId: string, status: MessageStatus): Promise<void>;
}