import Surface from "@components/ui/Surface";
import { ReactNode } from "react";

type MessageStatus = "sent" | "delivered" | "read";

interface Message {
    from: "me" | "other";
    text: string;
    time: string;
    status?: MessageStatus;
}

export default function ChatMessage({ msg }: { msg: Message }) {
    const isMe = msg.from === "me";

    const statusIcon: Record<MessageStatus, string> = {
        sent: "✓",
        delivered: "✓✓",
        read: "✓✓",
    };

    const currentStatus: MessageStatus = msg.status ?? "sent";

    const statusClass =
        currentStatus === "read" ? "text-[var(--primary)]" : "opacity-60";

    return (
        <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
            <div className="flex flex-col max-w-[70%]">

                <Surface
                    className={`
                        p-3 rounded-xl fade-in
                        ${isMe
                        ? "neon-pulse bg-[var(--primary)] text-white"
                        : "bg-[var(--bg-surface)]"
                    }
                    `}
                >
                    {msg.text}
                </Surface>

                <div
                    className={`text-xs mt-1 flex items-center gap-2 ${
                        isMe ? "justify-end" : "opacity-60"
                    }`}
                >
                    <span>{msg.time}</span>

                    {isMe && (
                        <span className={statusClass}>
                            {statusIcon[currentStatus]}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}