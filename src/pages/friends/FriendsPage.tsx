import { useState } from "react";
import FriendTabs from "@pages//friends/FriendsTabs";
import FriendsList from "@pages//friends/FriendsList";

export default function FriendsPage() {
    const [tab, setTab] = useState<"friends" | "requests" | "outgoing" | "search">(
        "friends"
    );

    return (
        <div className="h-[calc(100vh-80px)] overflow-hidden p-6 text-[var(--text-main)]">

            <h1 className="text-3xl font-bold neon-text mb-6 fade-in">
                Friends
            </h1>

            <FriendTabs active={tab} onChange={setTab} />

            <div className="h-[calc(100%-150px)] overflow-y-auto mt-4">
                <FriendsList tab={tab} />
            </div>

        </div>
    );
}