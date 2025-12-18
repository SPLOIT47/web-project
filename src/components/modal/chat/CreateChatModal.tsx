import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import BaseModal from "@components/ui/modal/BaseModal";
import Card from "@components/ui/Card";
import Button from "@components/ui/Button";
import Input from "@components/ui/Input";
import Avatar from "@components/ui/Avatar";
import Icon from "@components/ui/Icon";

import { ServiceLocator } from "@/application/ServiceLocator";
import type { User } from "@/domain/user/User";
import { useChatStore } from "@/store/chatStore";
import { useAuthStore, useUserStore } from "@/store";

export default function CreateChatModal({
                                            open,
                                            onClose,
                                        }: {
    open: boolean;
    onClose: () => void;
}) {
    const { t } = useTranslation();

    const [query, setQuery] = useState("");
    const [users, setUsers] = useState<User[]>([]);
    const [selected, setSelected] = useState<User | null>(null);

    const createChat = useChatStore(s => s.createChat);
    const upsertMany = useUserStore(s => s.upsertMany);

    useEffect(() => {
        if (!query.trim()) {
            setUsers([]);
            return;
        }

        const me = useAuthStore.getState().user;
        if (!me) return;

        ServiceLocator.userService.search(query).then(result => {
            const filtered = result.filter(u => u.id !== me.id);
            setUsers(filtered);
            upsertMany(filtered);
        });
    }, [query, upsertMany]);

    const handleCreate = async () => {
        const me = useAuthStore.getState().user;
        if (!me || !selected) return;

        await createChat({
            type: "private",
            members: [me.id, selected.id],
        });

        onClose();
    };

    return (
        <BaseModal open={open} onClose={onClose} maxWidth="max-w-lg">
            <Card className="p-6 flex flex-col gap-4">
                <h2 className="text-xl font-bold neon-text">
                    {t("modal.createChat.title")}
                </h2>

                <Input
                    placeholder={t("modal.createChat.searchUsers")}
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                />

                <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                    {users.map(u => {
                        const isSelected = selected?.id === u.id;

                        return (
                            <div
                                key={u.id}
                                onClick={() =>
                                    setSelected(
                                        isSelected ? null : u
                                    )
                                }
                                className={`
                                    flex items-center gap-3 p-2 rounded cursor-pointer
                                    ${
                                    isSelected
                                        ? "neon-surface"
                                        : "bg-[var(--bg-surface)]"
                                }
                                `}
                            >
                                <Avatar src={u.avatarUrl} size={36} />

                                <div className="flex-1 min-w-0">
                                    <div className="font-medium truncate">
                                        {u.name} {u.surname}
                                    </div>
                                    <div className="text-xs opacity-60 truncate">
                                        @{u.username}
                                    </div>
                                </div>

                                {isSelected && <Icon name="check" />}
                            </div>
                        );
                    })}
                </div>

                <Button
                    disabled={!selected}
                    onClick={handleCreate}
                >
                    {t("modal.createChat.create")}
                </Button>
            </Card>
        </BaseModal>
    );
}