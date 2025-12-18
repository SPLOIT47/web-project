import type { ChatService } from "@/application/chat/ChatService";
import type { Chat } from "@/domain/chat/Chat";
import type { CreateChatPayload } from "@/domain/chat/CreateChatPayload";
import type { SendMessagePayload } from "@/domain/chat/SendMessagePayload";

import { mockResponse } from "./mockApi";
import { loadDb, saveDb } from "@/infrastructure/mock/database";

export class MockChatService implements ChatService {
    async getMyChats(userId: string): Promise<Chat[]> {
        const db = loadDb();

        return mockResponse(
            db.chats.filter(
                c =>
                    (c.type !== "community" &&
                        c.members.includes(userId)) ||
                    (c.type === "community" && c.userId === userId)
            )
        );
    }

    async getCommunityChats(communityId: string): Promise<Chat[]> {
        const db = loadDb();

        return mockResponse(
            db.chats.filter(
                c =>
                    c.type === "community" &&
                    c.communityId === communityId &&
                    !!c.userId
            )
        );
    }

    async getOrCreateCommunityChat(
        communityId: string,
        userId: string
    ): Promise<Chat> {
        const db = loadDb();

        let chat = db.chats.find(
            c =>
                c.type === "community" &&
                c.communityId === communityId &&
                c.userId === userId
        );

        if (!chat) {
            chat = {
                id: crypto.randomUUID(),
                type: "community",
                communityId,
                userId,
                members: [],
                lastMessage: null,
                createdAt: new Date().toISOString(),
            };

            db.chats.unshift(chat);
            saveDb(db);
        }

        return mockResponse(chat);
    }

    async createChat(payload: CreateChatPayload): Promise<Chat> {
        const db = loadDb();

        const chat: Chat = {
            id: crypto.randomUUID(),
            type: payload.type,
            members: payload.members,
            title:
                payload.type === "group"
                    ? payload.title
                    : undefined,
            lastMessage: null,
            createdAt: new Date().toISOString(),
        };

        db.chats.unshift(chat);
        saveDb(db);

        return mockResponse(chat);
    }

    async deleteChat(chatId: string): Promise<void> {
        const db = loadDb();

        db.chats = db.chats.filter(c => c.id !== chatId);
        db.messages = db.messages.filter(m => m.chatId !== chatId);

        saveDb(db);
        return mockResponse(undefined);
    }

    async getMessages(chatId: string): Promise<Message[]> {
        const db = loadDb();

        return mockResponse(
            db.messages.filter(m => m.chatId === chatId)
        );
    }

    async sendMessage(
        chatId: string,
        author: Message["author"],
        payload: SendMessagePayload
    ): Promise<Message> {
        const db = loadDb();

        const message: Message = {
            id: crypto.randomUUID(),
            chatId,
            author,
            text: payload.text,
            createdAt: new Date().toISOString(),
            status: "sent",
        };

        db.messages.push(message);

        const chat = db.chats.find(c => c.id === chatId);
        if (chat) {
            chat.lastMessage = message;
        }

        saveDb(db);
        return mockResponse(message);
    }
}