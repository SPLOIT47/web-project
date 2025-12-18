type MessageAuthor =
    | { type: "user"; userId: string }
    | { type: "community"; communityId: string; senderUserId: string };

interface Message {
    id: string;
    chatId: string;

    author: MessageAuthor;

    text: string;
    attachments?: string[];

    createdAt: string;
    status?: "sent" | "delivered" | "read";
}