import Surface from "@components/ui/Surface";
import { useAuthStore } from "@/store";

export default function ChatMessage({ msg }: { msg: Message }) {
    const authUser = useAuthStore(s => s.user);

    const isMe =
        msg.author.type === "user" &&
        msg.author.userId === authUser?.id;

    const statusIcon = {
        sent: "✓",
        delivered: "✓✓",
        read: "✓✓",
    };

    return (
        <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
            <div className="flex flex-col max-w-[70%]">

                <Surface
                    className={`
                        p-3 rounded-xl fade-in
                        ${
                        isMe
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
                    <span>
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </span>

                    {isMe && msg.status && (
                        <span
                            className={
                                msg.status === "read"
                                    ? "text-[var(--primary)]"
                                    : "opacity-60"
                            }
                        >
                            {statusIcon[msg.status]}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}