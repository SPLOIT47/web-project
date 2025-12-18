import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import Button from "@components/ui/Button";
import Avatar from "@components/ui/Avatar";

import {useAuthStore, useChatStore} from "@/store";
import { useFriendsStore } from "@/store/friendsStore";
import type { User } from "@/domain/user/User";

type Props = {
    user: User;
    type: "friend" | "request" | "outgoing" | "search";
};

export default function FriendCard({ user, type }: Props) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const authUser = useAuthStore(s => s.user)!;
    const openOrCreatePrivateChat =
        useChatStore(s => s.openOrCreatePrivateChat);

    const {
        accept,
        decline,
        remove,
        sendRequest,
        cancel,
        getRelation,
    } = useFriendsStore();

    const relation = getRelation(user.id);

    return (
        <div
            className="
        w-full
        max-w-md
        mx-auto
        p-3 mobile:p-4
        rounded-xl
        border
        bg-[var(--bg-surface)]
        flex flex-col mobile:flex-row
        gap-3 mobile:gap-4
        items-center mobile:items-start
    "
        >
            <div className="flex items-center gap-4 flex-1 min-w-0">
                <Avatar src={user.avatarUrl} size={52} />

                <div className="min-w-0">
                    <div
                        className="
                            font-semibold neon-text
                            cursor-pointer
                            hover:underline
                            truncate
                        "
                        onClick={() => navigate(`/profile/${user.id}`)}
                    >
                        {user.name} {user.surname}
                    </div>
                </div>
            </div>

            <div
                className="
        flex flex-row mobile:flex-col
        gap-2
        items-center
        justify-center
        min-w-[140px]
    "
            >
                {type === "friend" && (
                    <>
                        <Button
                            className="min-w-[120px]"
                            onClick={async () => {
                                await openOrCreatePrivateChat(user.id);
                                navigate("/messages");
                            }}
                        >
                            {t("friends.message")}
                        </Button>
                        <Button
                            className="min-w-[120px]"
                            onClick={() => remove(authUser.id, user.id)}
                        >
                            {t("friends.remove")}
                        </Button>
                    </>
                )}

                {type === "request" && (
                    <>
                        <Button
                            className="min-w-[120px]"
                            onClick={() => accept(authUser.id, user.id)}
                        >
                            {t("friends.acceptRequest")}
                        </Button>
                        <Button
                            className="min-w-[120px]"
                            onClick={() => decline(authUser.id, user.id)}
                        >
                            {t("friends.decline")}
                        </Button>
                    </>
                )}

                {type === "outgoing" && (
                    <Button
                        className="min-w-[120px]"
                        onClick={() => cancel(authUser.id, user.id)}
                    >
                        {t("friends.cancel")}
                    </Button>
                )}

                {type === "search" && (
                    <>
                        {relation === "none" && (
                            <Button
                                className="min-w-[120px]"
                                onClick={() =>
                                    sendRequest(authUser.id, user.id)
                                }
                            >
                                {t("friends.addFriend")}
                            </Button>
                        )}

                        {relation === "outgoing" && (
                            <Button
                                className="min-w-[120px]"
                                onClick={() =>
                                    cancel(authUser.id, user.id)
                                }
                            >
                                {t("friends.cancelRequest")}
                            </Button>
                        )}

                        {relation === "incoming" && (
                            <>
                                <Button
                                    className="min-w-[120px]"
                                    onClick={() =>
                                        accept(authUser.id, user.id)
                                    }
                                >
                                    {t("friends.acceptRequest")}
                                </Button>
                                <Button
                                    className="min-w-[120px]"
                                    onClick={() =>
                                        decline(authUser.id, user.id)
                                    }
                                >
                                    {t("friends.decline")}
                                </Button>
                            </>
                        )}

                        {relation === "friends" && (
                            <Button
                                className="min-w-[120px]"
                                onClick={() =>
                                    remove(authUser.id, user.id)
                                }
                            >
                                {t("friends.removeFriend")}
                            </Button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}