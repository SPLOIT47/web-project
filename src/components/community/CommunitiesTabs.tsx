export default function CommunitiesTabs({
                                            active,
                                            onChange,
                                        }: {
    active: string;
    onChange: (t: any) => void;
}) {
    const tabs = [
        { id: "all", label: "All" },
        { id: "my", label: "My Communities" },
        { id: "manage", label: "Manage" },
        { id: "search", label: "Search" },
    ];

    return (
        <div className="flex gap-3 fade-in">
            {tabs.map((t) => (
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