import type { AuthService } from "@/application/auth/AuthService";
import type { LoginRequest } from "@/domain/auth/LoginRequest";
import type { LoginResponse } from "@/domain/auth/LoginResponse";
import type { RegisterRequest } from "@/domain/auth/RegisterRequest";
import type { RegisterResponse } from "@/domain/auth/RegisterResponse";

import { faker } from "@faker-js/faker";
import { mockResponse } from "./mockApi";
import type { User } from "@/domain/user/User";
import type { EditProfilePayload } from "@/domain/user/EditProfilePayload";
import {loadDb, saveDb} from "@/infrastructure/mock/database";

let session: LoginResponse | null = null;

export class MockAuthService implements AuthService {

    async login(data: LoginRequest): Promise<LoginResponse | null> {
        const db = loadDb();

        const normalized = data.identifier.toLowerCase();

        const user = db.users.find(
            u =>
                u.username.toLowerCase() === normalized ||
                u.email.toLowerCase() === normalized
        );

        if (!user) return mockResponse(null);

        session = {
            user,
            token: "mock-token-" + user.id,
        };

        return mockResponse(session);
    }

    async register(data: RegisterRequest): Promise<RegisterResponse | null> {
        const db = loadDb();

        if (db.users.some(u => u.username === data.username)) {
            return mockResponse(null);
        }

        const newUser: User = {
            id: faker.string.uuid(),

            username: data.username,
            email: data.email,
            name: data.name,
            surname: data.surname,
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

            incomingRequests: [],
            outgoingRequests: [],

            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        db.users.push(newUser);
        saveDb(db);

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

    async updateProfile(
        id: string,
        data: EditProfilePayload
    ): Promise<User> {
        const db = loadDb();

        const user = db.users.find(u => u.id === id);
        if (!user) throw new Error("User not found");

        Object.assign(user, data, {
            updatedAt: new Date().toISOString(),
        });

        saveDb(db);
        return mockResponse(user);
    }

    async deleteAccount(userId: string): Promise<void> {
        const db = loadDb();

        db.users = db.users.filter(u => u.id !== userId);

        for (const user of db.users) {
            user.friends = user.friends.filter((id: string) => id !== userId);
            user.followers = user.followers.filter((id: string) => id !== userId);
            user.following = user.following?.filter((id: string) => id !== userId);
        }

        saveDb(db);

        session = null;

        return mockResponse(undefined);
    }
}