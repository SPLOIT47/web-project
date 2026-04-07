import { useTranslation } from "react-i18next";
import type { CommunityTab } from "@/domain/community/CommunityTab";

export default function CommunitiesTabs({
    active,
    onChange,
}: {
    active: CommunityTab;
    onChange: (t: CommunityTab) => void;
}) {
    const { t } = useTranslation();
    const tabs: { id: CommunityTab; label: string }[] = [
        { id: "all", label: t("communities.tabs.all") },
        { id: "my", label: t("communities.tabs.my") },
        { id: "manage", label: t("communities.tabs.manage") },
        { id: "search", label: t("communities.tabs.search") },
    ];

    return (
        <div className="
            flex gap-2 mobile:gap-3 
            overflow-x-auto 
            fade-in
            -mx-3 mobile:-mx-4 tablet:-mx-6 px-3 mobile:px-4 tablet:px-6
            scrollbar-hide
        ">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    type="button"
                    onClick={() => onChange(tab.id)}
                    className={`
                        px-3 mobile:px-4 py-1.5 mobile:py-2 
                        rounded-lg border 
                        text-xs mobile:text-sm tablet:text-base
                        whitespace-nowrap
                        transition-all 
                        shrink-0
                        ${active === tab.id
                        ? "neon-surface neon-surface-hover"
                        : "border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-[var(--primary)]"
                    }
                    `}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
