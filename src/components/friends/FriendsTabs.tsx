import { useTranslation } from "react-i18next";

export default function FriendTabs({
                                       active,
                                       onChange,
                                   }: {
    active: string;
    onChange: (t: any) => void;
}) {
    const { t } = useTranslation();
    const tabs = [
        { id: "friends", label: t("friends.tabs.friends") },
        { id: "requests", label: t("friends.tabs.requests") },
        { id: "outgoing", label: t("friends.tabs.outgoing") },
        { id: "search", label: t("friends.tabs.search") },
    ];

    return (
        <div className="
            flex gap-2 mobile:gap-3 
            overflow-x-auto 
            fade-in
            -mx-3 mobile:-mx-4 tablet:-mx-6 px-3 mobile:px-4 tablet:px-6
            scrollbar-hide
        ">
            {tabs.map((t) => (
                <button
                    key={t.id}
                    onClick={() => onChange(t.id)}
                    className={`
                        px-3 mobile:px-4 py-1.5 mobile:py-2 
                        rounded-lg border 
                        text-xs mobile:text-sm tablet:text-base
                        whitespace-nowrap
                        transition-all 
                        shrink-0
                        ${active === t.id
                        ? "neon-surface neon-surface-hover"
                        : "border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-[var(--primary)]"
                    }
                    `}
                >
                    {t.label}
                </button>
            ))}
        </div>
    );
}