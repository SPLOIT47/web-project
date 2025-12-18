export interface ChatPreview {
    id: string;

    title: string;
    avatarUrl?: string;

    lastMessage?: string;
    lastMessageAt?: string;

    type: "private" | "group" | "community";
}