import type { Identifiable } from "../common/Identifiable";
import type { Timestamped } from "../common/Timestamped";

export type MessageStatus = "sent" | "delivered" | "read";

export interface Message extends Identifiable, Timestamped {
    chatId: string;
    senderId: string;
    text: string;
    status: MessageStatus;
}