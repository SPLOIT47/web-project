import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { useAuthStore } from "@/store";
import { useFriendsStore } from "@/store/friendsStore";
import { FriendTab } from "@/domain/friend/FriendTab";

import FriendCard from "@components/friends/FriendCard";
import FriendsSearch from "@components/friends/FriendSearch";

export default function FriendsList({ tab }: { tab: FriendTab }) {
    const { t } = useTranslation();
    const authUser = useAuthStore(s => s.user);

    const {
        friends,
        incoming,
        outgoing,
        loading,
        load,
    } = useFriendsStore();

    useEffect(() => {
        if (authUser) {
            load(authUser.id, tab);
        }
    }, [authUser, tab, load]);

    if (loading) {
        return (
            <div className="opacity-60 text-center">
                {t("common.loading")}
            </div>
        );
    }

    if (tab === "search") {
        return <FriendsSearch />;
    }

    const list =
        tab === "friends"
            ? friends
            : tab === "requests"
                ? incoming
                : tab === "outgoing"
                    ? outgoing
                    : [];

    return (
        <div
            className="
        grid
        grid-cols-1
        tablet:grid-cols-2
        desktop:grid-cols-3
        gap-3 tablet:gap-4
        items-start
        pr-1 tablet:pr-2
    "
        >
            {list.map(user => (
                <FriendCard
                    key={user.id}
                    user={user}
                    type={
                        tab === "friends"
                            ? "friend"
                            : tab === "requests"
                                ? "request"
                                : "outgoing"
                    }
                />
            ))}
        </div>
    );
}