import type { User } from "@/domain/user/User";
import { loadDb, saveDb } from "./database";

let seeded = false;

export function seedMockDatabase() {
    if (seeded) return;
    seeded = true;

    const db = loadDb();

    if (db.users.length > 0) return;

    const alexId = "u-1";
    const kateId = "u-2";

    const users: User[] = [
        {
            id: alexId,
            username: "alex",
            name: "alex",
            surname: "degtyar",
            email: "alex@example.com",
            bio: "Backend enjoyer ☕ Java & systems",
            avatarUrl: "",

            birthday: "1998-03-05",
            city: "San Francisco",
            education: "MIT — Computer Science",

            friends: [kateId],
            incomingRequests: [],
            outgoingRequests: [],

            followers: [],
            following: [],
            communities: [],
            posts: [],
            chats: [],
            languages: ["English", "Russian"],

            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            id: kateId,
            username: "kate",
            name: "kate",
            surname: "Miller",
            email: "kate@example.com",
            bio: "UI / UX • Neon lover ✨",
            avatarUrl: "",

            city: "Berlin",

            friends: [alexId],
            incomingRequests: [],
            outgoingRequests: [],

            followers: [],
            following: [],
            communities: [],
            posts: [],
            chats: [],
            languages: ["English", "German"],

            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            id: "u-3",
            username: "john",
            name: "john",
            surname: "Doe",
            email: "john@example.com",
            bio: "Just a test user",
            avatarUrl: "",

            friends: [],
            incomingRequests: [],
            outgoingRequests: [],

            followers: [],
            following: [],
            communities: [],
            posts: [],
            chats: [],
            languages: ["English"],

            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    ];

    db.users.push(...users);
    saveDb(db);

    console.info(
        "✅ Mock DB seeded with users:",
        users.map(u => u.username)
    );
}