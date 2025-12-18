import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import Card from "@components/ui/Card";
import Avatar from "@components/ui/Avatar";
import Icon from "@components/ui/Icon";
import BaseModal from "@components/ui/modal/BaseModal";

import { ServiceLocator } from "@/application/ServiceLocator";
import type { User } from "@/domain/user/User";

export default function CommunityFollowersModal({
                                                    open,
                                                    userIds,
                                                    onClose,
                                                }: {
    open: boolean;
    userIds: string[];
    onClose: () => void;
}) {
    const { t } = useTranslation();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open) return;

        let mounted = true;
        setLoading(true);

        Promise.all(
            userIds.map(id =>
                ServiceLocator.userService.getById(id)
            )
        )
            .then(res => {
                if (!mounted) return;
                setUsers(res.filter(Boolean) as User[]);
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, [open, userIds]);

    return (
        <BaseModal open={open} onClose={onClose} maxWidth="max-w-md">
            <Card className="p-4 fade-in">

                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold neon-text">
                        {t("modal.communityFollowers.title")}
                    </h2>
                    <button onClick={onClose}>
                        <Icon name="times" />
                    </button>
                </div>

                {loading && (
                    <div className="opacity-60 text-center py-4">
                        {t("common.loading")}
                    </div>
                )}

                {!loading && users.length === 0 && (
                    <div className="opacity-60 text-center py-4">
                        {t("modal.communityFollowers.noFollowers")}
                    </div>
                )}

                {!loading && users.length > 0 && (
                    <div className="flex flex-col gap-3">
                        {users.map(u => (
                            <div
                                key={u.id}
                                className="flex items-center gap-3"
                            >
                                <Avatar src={u.avatarUrl} size={40} />
                                <div className="text-sm">
                                    <div className="font-medium">
                                        {u.name} {u.surname}
                                    </div>
                                    <div className="opacity-60">
                                        @{u.username}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </BaseModal>
    );
}