import { useTranslation } from "react-i18next";

export type CommunitySettingsTab =
    | "general"
    | "appearance"
    | "members"
    | "permissions"
    | "delete";

type Props = {
    active: CommunitySettingsTab;
    onChange: (tab: CommunitySettingsTab) => void;
};

export default function SettingsTabs({ active, onChange }: Props) {
    const { t } = useTranslation();

    const tabs: { id: CommunitySettingsTab; label: string }[] = [
        { id: "general", label: t("communitySettings.tabs.general") },
        { id: "appearance", label: t("communitySettings.tabs.appearance") },
        { id: "members", label: t("communitySettings.tabs.members") },
        { id: "permissions", label: t("communitySettings.tabs.permissions") },
        { id: "delete", label: t("communitySettings.tabs.delete") },
    ];

    return (
        <div className="flex gap-3 fade-in">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => onChange(tab.id)}
                    className={`
                        px-4 py-2 rounded-lg border 
                        transition-all
                        ${
                        active === tab.id
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