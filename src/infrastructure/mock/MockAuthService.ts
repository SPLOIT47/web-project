import type { AuthService } from "@/domain/auth/AuthService";
import type { LoginRequest } from "@/domain/auth/LoginRequest";
import type { LoginResponse } from "@/domain/auth/LoginResponse";
import type { RegisterRequest } from "@/domain/auth/RegisterRequest";
import type { RegisterResponse } from "@/domain/auth/RegisterResponse";

import { db } from "./database";
import { faker } from "@faker-js/faker";
import { mockResponse } from "./mockApi";
import {User} from "@/domain/user/User";

let session: LoginResponse | null = null;

export class MockAuthService implements AuthService {
    async login({ username }: LoginRequest): Promise<LoginResponse | null> {
        const user = db.users.find(
            u => u.username.toLowerCase() === username.toLowerCase()
        );

        if (!user) {
            return mockResponse(null);
        }

        session = {
            user,
            token: "mock-token-" + user.id,
        };

        return mockResponse(session);
    }

    async register(data: RegisterRequest): Promise<RegisterResponse | null> {
        if (db.users.some(u => u.username === data.username)) {
            return mockResponse(null);
        }

        const newUser: User = {
            id: faker.string.uuid(),

            username: data.username,
            displayName: data.name,
            name: data.name,
            avatarUrl: faker.image.avatar(),

            bio: "",
            birthday: undefined,
            city: undefined,
            education: undefined,

            followers: [],
            following: [],
            friends: [],
            communities: [],
            languages: [],

            posts: [],
            chats: [],

            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        db.users.push(newUser);

        session = {
            user: newUser,
            token: "mock-token-" + newUser.id,
        };

        return mockResponse(session);
    }

    async logout(): Promise<void> {
        session = null;
        return mockResponse(undefined);
    }

    async getCurrentSession(): Promise<LoginResponse | null> {
        return mockResponse(session);
    }
}