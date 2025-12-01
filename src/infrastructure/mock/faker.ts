import { faker } from "@faker-js/faker";
import type { User } from "@/domain/user/User";
import type { Community } from "@/domain/community/Community";
import type { Post } from "@/domain/post/Post";
import { db } from "./database";

export function generateUser(): User {
    const id = faker.string.uuid();

    return {
        id,
        name: faker.person.fullName(),
        username: faker.internet.username(),
        avatarUrl: faker.image.avatar(),

        birthday: faker.date.birthdate().toISOString(),
        city: faker.location.city(),
        education: faker.company.name(),

        followers: [],
        following: [],
        friends: [],
        posts: [],
        chats: [],

        createdAt: faker.date.past().toISOString(),
        updatedAt: new Date().toISOString(),
    };
}

export function generateCommunity(): Community {
    const id = faker.string.uuid();

    return {
        id,
        name: faker.company.name(),
        avatarUrl: faker.image.avatar(),
        coverUrl: faker.image.urlPicsumPhotos(),
        category: faker.commerce.department(),
        type: faker.helpers.arrayElement(["public", "group", "event"]),
        description: faker.lorem.sentence(),

        followers: [],
        following: undefined,
        admins: [],
        moderators: [],
        posts: [],

        createdAt: faker.date.past().toISOString(),
        updatedAt: new Date().toISOString(),
    };
}

export function generatePost(authorId: string): Post {
    return {
        id: faker.string.uuid(),
        authorId,
        content: faker.lorem.paragraph(),
        images: Math.random() > 0.7 ? [faker.image.urlPicsumPhotos()] : [],
        likes: [],
        comments: [],
        createdAt: faker.date.recent().toISOString(),
        updatedAt: new Date().toISOString(),
    };
}

export function initFakeDatabase(userCount = 10, communityCount = 5) {
    for (let i = 0; i < userCount; i++) {
        const u = generateUser();
        db.users.push(u);

        const posts = Array.from(
            { length: faker.number.int({ min: 1, max: 3 }) },
            () => generatePost(u.id)
        );

        posts.forEach(p => {
            db.posts.push(p);
            u.posts.push(p.id);
        });
    }

    for (let i = 0; i < communityCount; i++) {
        const c = generateCommunity();
        db.communities.push(c);
    }
}