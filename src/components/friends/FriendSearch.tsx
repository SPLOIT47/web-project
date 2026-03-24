import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/store/authStore";
import { useSearchStore } from "@/store/searchStore";
import FriendCard from "./FriendCard";

export default function FriendsSearch() {
    const { t } = useTranslation();
    const [text, setText] = useState("");
    const { results, loading, search } = useSearchStore();
    const meId = useAuthStore(s => s.user?.id);

    const visibleResults = useMemo(
        () =>
            results.filter(
                r =>
                    r.type === "user" &&
                    (!meId || r.user.id !== meId),
            ),
        [results, meId],
    );

    return (
        <div className="flex flex-col gap-4 fade-in">

        <input
            className="p-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)]"
    placeholder={t("friends.searchPeople")}
    value={text}
    onChange={e => {
        const v = e.target.value;
        setText(v);
        search(v, "users");
    }}
    />

    {loading && <div className="opacity-60">{t("friends.searching")}</div>}

        {visibleResults.map(r => (
            <FriendCard
                key={r.user.id}
                user={r.user}
                type="search"
            />
        ))}
        </div>
    );
}