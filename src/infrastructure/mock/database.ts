import type { User } from "@/domain/user/User";
import type { Community } from "@/domain/community/Community";
import type { Post } from "@/domain/post/Post";
import type { Chat } from "@/domain/chat/Chat";
import type { Message } from "@/domain/chat/Message";

export const db = {
    users: [] as User[],
    communities: [] as Community[],
    posts: [] as Post[],
    chats: [] as Chat[],
    messages: [] as Message[],
};