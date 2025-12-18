import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import Button from "@components/ui/Button";

import { useChatStore } from "@/store/chatStore";
import { useAuthStore } from "@/store/authStore";

export default function MessageInput() {
    const { t } = useTranslation();
    const [text, setText] = useState("");

    const activeChatId = useChatStore(s => s.activeChatId);
    const userChats = useChatStore(s => s.userChats);
    const communityChats = useChatStore(s => s.communityChats);
    const sendMessage = useChatStore(s => s.sendMessage);

    const authUser = useAuthStore(s => s.user);

    const chat = useMemo(() => {
        if (!activeChatId) return null;

        return (
            userChats.find(c => c.id === activeChatId) ??
            communityChats.find(c => c.id === activeChatId) ??
            null
        );
    }, [activeChatId, userChats, communityChats]);

    if (!activeChatId || !authUser || !chat) return null;

    const onSend = async () => {
        const trimmed = text.trim();
        if (!trimmed) return;

        const author: MessageAuthor =
            chat.type === "community" && chat.communityId
                ? {
                    type: "community",
                    communityId: chat.communityId,
                    senderUserId: authUser.id,
                }
                : {
                    type: "user",
                    userId: authUser.id,
                };

        await sendMessage(chat.id, author, trimmed);
        setText("");
    };

    return (
        <div className="flex gap-3 items-center p-3 border-t">
            <input
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={e => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        onSend();
                    }
                }}
                className="
                    flex-1 bg-[var(--bg-surface)]
                    border border-[var(--border-color)]
                    p-3 rounded-xl
                    focus:ring-2 focus:ring-[var(--primary)]
                "
                placeholder={t("chat.placeholder")}
            />

            <Button className="px-6 neon-pulse" onClick={onSend}>
                {t("chat.send")}
            </Button>
        </div>
    );
}