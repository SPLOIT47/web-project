import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import Avatar from "@components/ui/Avatar";

import { useChatStore } from "@/store/chatStore";
import { useCommunityStore } from "@/store/communityStore";
import { useUserStore } from "@/store/userStore";
import { useAuthStore } from "@/store/authStore";
import { useModalStore } from "@/store/modalStore";

export default function ChatHeader() {
    const { t } = useTranslation();

    const activeChatId = useChatStore(s => s.activeChatId);
    const userChats = useChatStore(s => s.userChats);
    const communityChats = useChatStore(s => s.communityChats);

    const me = useAuthStore(s => s.user);

    const getUserById = useUserStore(s => s.getById);
    const getCommunityById = useCommunityStore(s => s.getById);

    const openChatInfo = useModalStore(s => s.openChatInfo);
    const openCommunityDetails =
        useModalStore(s => s.openCommunityDetails);

    const chat = useMemo(() => {
        if (!activeChatId) return null;

        return (
            userChats.find(c => c.id === activeChatId) ??
            communityChats.find(c => c.id === activeChatId) ??
            null
        );
    }, [activeChatId, userChats, communityChats]);

    if (!chat || !me) {
        return (
            <div className="p-4 border-b opacity-60">
                {t("chat.select")}
            </div>
        );
    }

    let title = "";
    let subtitle = "";
    let avatarUrl: string | undefined;
    let onTitleClick: (() => void) | undefined;
    let clickable = false;

    if (chat.type === "private") {
        const otherUserId =
            chat.members.find(id => id !== me.id);

        const user = otherUserId
            ? getUserById(otherUserId)
            : null;

        title = user
            ? `${user.name} ${user.surname ?? ""}`
            : t("chat.userFallback");

        avatarUrl = user?.avatarUrl;
        subtitle = t("chat.online");
    }

    if (chat.type === "group") {
        title = chat.title ?? t("chat.groupFallback");
        subtitle = t("chat.members", {
            count: chat.members.length,
        });

        clickable = true;
        onTitleClick = () => openChatInfo(chat.id);
    }

    if (chat.type === "community" && chat.communityId) {
        const communityId = chat.communityId;
        const community = getCommunityById(communityId);

        title = community?.name ?? t("chat.communityFallback");
        avatarUrl = community?.avatarUrl;
        subtitle = t("chat.communitySubtitle");

        clickable = true;
        onTitleClick = () =>
            openCommunityDetails(communityId);
    }

    return (
        <div className="p-4 border-b flex items-center gap-3">
            <Avatar src={avatarUrl} size={48} />

            <div className="min-w-0">
                <div
                    className={`
                        text-lg font-bold truncate
                        ${
                        clickable
                            ? "cursor-pointer hover:underline"
                            : "cursor-default"
                    }
                    `}
                    onClick={onTitleClick}
                >
                    {title}
                </div>

                <div className="text-sm opacity-70 truncate">
                    {subtitle}
                </div>
            </div>
        </div>
    );
}