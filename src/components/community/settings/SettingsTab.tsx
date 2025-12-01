export default function SettingsTabs({ active, onChange }) {
    const tabs = [
        { id: "general", label: "General" },
        { id: "appearance", label: "Appearance" },
        { id: "members", label: "Members" },
        { id: "permissions", label: "Permissions" },
        { id: "delete", label: "Delete" },
    ];

    return (
        <div className="flex gap-3 fade-in">
            {tabs.map(t => (
                <button
                    key={t.id}
                    onClick={() => onChange(t.id)}
                    className={`
                        px-4 py-2 rounded-lg border 
                        transition-all 
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