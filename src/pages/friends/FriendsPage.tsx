import { useState } from "react";
import { useTranslation } from "react-i18next";
import FriendTabs from "@components/friends/FriendsTabs";
import FriendsList from "@components/friends/FriendsList";

export default function FriendsPage() {
    const { t } = useTranslation();
    const [tab, setTab] = useState<"friends" | "requests" | "outgoing" | "search">(
        "friends"
    );

    return (
        <div className="
            h-[calc(100vh-56px)] tablet:h-[calc(100vh-64px)] laptop:h-[calc(100vh-80px)] 
            overflow-hidden 
            p-3 mobile:p-4 tablet:p-6 
            text-[var(--text-main)]
        ">

            <h1 className="
                text-2xl mobile:text-3xl font-bold neon-text 
                mb-4 tablet:mb-6 
                fade-in
            ">
                {t("friends.title")}
            </h1>

            <FriendTabs active={tab} onChange={setTab} />

            <div className="
                h-[calc(100%-120px)] mobile:h-[calc(100%-130px)] tablet:h-[calc(100%-150px)] 
                overflow-y-auto 
                mt-3 tablet:mt-4
            ">
                <FriendsList tab={tab} />
            </div>

        </div>
    );
}