import { useEffect } from "react";
import { useParams } from "react-router-dom";

import ChatList from "@components/chat/ChatList";
import ChatWindow from "@components/chat/ChatWindow";
import MessageInput from "@components/chat/MessageInput";
import ChatHeader from "@components/chat/ChatHeader";

import { useChatStore } from "@/store/chatStore";
import {useTranslation} from "react-i18next";

type Props = {
    mode: "user" | "community";
};

export default function MessengerPage({ mode }: Props) {
    const { id: communityId } = useParams<{ id: string }>();
    const { t } = useTranslation();

    const activeChatId = useChatStore(s => s.activeChatId);

    const loadUserChats = useChatStore(s => s.loadUserChats);
    const loadCommunityChats = useChatStore(s => s.loadCommunityChats);
    const clearActiveChat = useChatStore(s => s.clearActiveChat);

    useEffect(() => {
        clearActiveChat();

        if (mode === "user") {
            loadUserChats();
        }

        if (mode === "community" && communityId) {
            loadCommunityChats(communityId);
        }
    }, [mode, communityId]);

    return (
        <div
            className="
                flex flex-col laptop:flex-row
                h-[calc(100vh-56px)]
                tablet:h-[calc(100vh-64px)]
                laptop:h-[calc(100vh-80px)]
            "
        >
            <aside
                className="
                    w-full laptop:w-72
                    border-r-0 laptop:border-r
                    border-[var(--border-color)]
                    h-1/3 laptop:h-full
                    shrink-0
                "
            >
                <ChatList
                    mode={mode}
                />
            </aside>

            <div className="flex flex-col flex-1 min-h-0">
                {!activeChatId ? (
                    <div className="flex flex-1 items-center justify-center opacity-60 text-sm">
                        {t("chat.select")}
                    </div>
                ) : (
                    <>
                        <ChatHeader />
                        <ChatWindow />
                        <MessageInput />
                    </>
                )}
            </div>
        </div>
    );
}