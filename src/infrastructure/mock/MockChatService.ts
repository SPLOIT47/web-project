import type { ChatService } from "@/domain/chat/ChatService";
import type { Chat } from "@/domain/chat/Chat";
import type { Message, MessageStatus } from "@/domain/chat/Message";
import { db } from "./database";
import { faker } from "@faker-js/faker";
import { mockResponse } from "./mockApi";

export class MockChatService implements ChatService {
    async getById(id: string): Promise<Chat | null> {
        return mockResponse(db.chats.find(c => c.id === id) || null);
    }

    async getByUser(userId: string): Promise<Chat[]> {
        return mockResponse(db.chats.filter(c => c.participants.includes(userId)));
    }

    async create(userA: string, userB: string): Promise<Chat> {
        const existing = db.chats.find(
            c => c.participants.includes(userA) && c.participants.includes(userB)
        );
        if (existing) return mockResponse(existing);

        const chat: Chat = {
            id: faker.string.uuid(),
            participants: [userA, userB],
            messages: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        db.chats.push(chat);
        return mockResponse(chat);
    }

    async getMessages(chatId: string): Promise<Message[]> {
        return mockResponse(db.messages.filter(m => m.chatId === chatId));
    }

    async sendMessage(chatId: string, senderId: string, text: string): Promise<Message> {
        const msg: Message = {
            id: faker.string.uuid(),
            chatId,
            senderId,
            text,
            status: "sent",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        db.messages.push(msg);

        const chat = db.chats.find(c => c.id === chatId);
        if (chat) {
            chat.messages.push(msg.id);
            chat.updatedAt = new Date().toISOString();
        }

        return mockResponse(msg);
    }

    async updateMessageStatus(messageId: string, status: MessageStatus): Promise<void> {
        const msg = db.messages.find(m => m.id === messageId);
        if (msg) {
            msg.status = status;
            msg.updatedAt = new Date().toISOString();
        }
        return mockResponse(undefined);
    }
}