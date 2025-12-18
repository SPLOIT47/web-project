import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import Avatar from "@components/ui/Avatar";
import Button from "@components/ui/Button";
import Icon from "@components/ui/Icon";

import { useChatStore } from "@/store/chatStore";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";
import { useModalStore } from "@/store/modalStore";

type Props = {
    mode: "user" | "community";
};

export default function ChatList({ mode }: Props) {
    const { t } = useTranslation();

    const {
        userChats,
        communityChats,
        activeChatId,
        openChat,
    } = useChatStore();

    const me = useAuthStore(s => s.user);
    const getUser = useUserStore(s => s.getById);
    const openCreateChat = useModalStore(s => s.openCreateChat);

    const chats =
        mode === "user" ? userChats : communityChats;

    const items = useMemo(() => {
        if (!me) return [];

        return chats.map(chat => {
            if (chat.type === "private") {
                const otherId =
                    chat.members.find(id => id !== me.id);
                const user = otherId
                    ? getUser(otherId)
                    : null;

                return {
                    id: chat.id,
                    title: user
                        ? `${user.name} ${user.surname ?? ""}`
                        : t("chat.userFallback"),
                    avatarUrl: user?.avatarUrl,
                    lastMessage: chat.lastMessage?.text,
                };
            }

            if (chat.type === "community") {
                const user = chat.userId
                    ? getUser(chat.userId)
                    : null;

                return {
                    id: chat.id,
                    title: user
                        ? `${user.name} ${user.surname ?? ""}`
                        : t("chat.userFallback"),
                    avatarUrl: user?.avatarUrl,
                    lastMessage: chat.lastMessage?.text,
                };
            }

            return null;
        }).filter(Boolean);
    }, [chats, me, getUser, t]);

    return (
        <div className="h-full flex flex-col">
            <div className="p-3 border-b flex justify-between">
                <h2 className="font-bold">
                    {mode === "community"
                        ? t("chat.communityInbox")
                        : t("chat.title")}
                </h2>

                {mode === "user" && (
                    <Button
                        onClick={openCreateChat}
                        className="flex gap-2"
                    >
                        <Icon name="plus" />
                        {t("chat.new")}
                    </Button>
                )}
            </div>

            <div className="p-3 flex flex-col gap-2 overflow-y-auto">
                {items.map(chat => (
                    <div
                        key={chat!.id}
                        onClick={() => openChat(chat!.id)}
                        className={`
                            flex gap-3 items-center p-3 rounded-xl cursor-pointer
                            ${
                            activeChatId === chat!.id
                                ? "neon-surface"
                                : "bg-[var(--bg-surface)] border"
                        }
                        `}
                    >
                        <Avatar src={chat!.avatarUrl} size={44} />
                        <div className="min-w-0">
                            <div className="font-bold truncate">
                                {chat!.title}
                            </div>
                            {chat!.lastMessage && (
                                <div className="text-sm opacity-70 truncate">
                                    {chat!.lastMessage}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}