import { useTranslation } from "react-i18next";

import BaseModal from "@components/ui/modal/BaseModal";
import Card from "@components/ui/Card";
import Button from "@components/ui/Button";
import Avatar from "@components/ui/Avatar";

import { useChatStore } from "@/store/chatStore";
import { useUserStore } from "@/store/userStore";
import { useAuthStore } from "@/store/authStore";

export default function ChatInfoModal({
                                          open,
                                          onClose,
                                          chatId,
                                      }: {
    open: boolean;
    onClose: () => void;
    chatId: string;
}) {
    const { t } = useTranslation();

    const userChats = useChatStore(s => s.userChats);
    const deleteChat = useChatStore(s => s.deleteChat);

    const getUser = useUserStore(s => s.getById);
    const me = useAuthStore(s => s.user);

    const chat = userChats.find(c => c.id === chatId);

    if (!chat || !me) return null;

    const otherUserId =
        chat.type === "private"
            ? chat.members.find(id => id !== me.id)
            : null;

    const otherUser = otherUserId
        ? getUser(otherUserId)
        : null;

    return (
        <BaseModal open={open} onClose={onClose}>
            <Card className="p-6 flex flex-col gap-4">

                <h2 className="text-xl font-bold neon-text">
                    {t("modal.chatInfo.title")}
                </h2>

                {otherUser && (
                    <div className="flex items-center gap-3">
                        <Avatar src={otherUser.avatarUrl} size={48} />
                        <div>
                            <div className="font-semibold">
                                {otherUser.name} {otherUser.surname}
                            </div>
                            <div className="text-sm opacity-60">
                                @{otherUser.username}
                            </div>
                        </div>
                    </div>
                )}

                <div className="pt-4 border-t flex justify-end">
                    <Button
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => {
                            deleteChat(chat.id);
                            onClose();
                        }}
                    >
                        {t("modal.chatInfo.deleteChat")}
                    </Button>
                </div>

            </Card>
        </BaseModal>
    );
}