export type ChatType = "private" | "group" | "community";

export interface Chat {
    id: string;
    type: ChatType;

    title?: string;
    avatarUrl?: string;

    members: string[];

    communityId?: string;
    userId?: string;

    lastMessage: Message | null;
    createdAt: string;
}