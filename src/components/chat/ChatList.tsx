export default function ChatList({
                                     onSelect,
                                     active
                                 }: {
    onSelect: (name: string) => void;
    active: string;
}) {
    const chats = [
        { name: "John Doe", last: "Typing...", typing: true },
        { name: "Emily", last: "Let's meet tomorrow", typing: false },
        { name: "System Bot", last: "Password changed", typing: false },
    ];

    return (
        <div className="p-3 flex flex-col gap-2">
            {chats.map((c) => (
                <div
                    key={c.name}
                    onClick={() => onSelect(c.name)}
                    className={`
                        p-3 rounded-xl cursor-pointer transition-all
                        ${active === c.name ? "neon-surface neon-surface-hover" : "bg-[var(--bg-surface)] border border-[var(--border-color)]"}
                    `}
                >
                    <div className="flex justify-between">
                        <div className="font-bold neon-text-hover">{c.name}</div>
                        {c.typing && <span className="text-xs text-[var(--primary)] animate-pulse">typing…</span>}
                    </div>

                    <div className="opacity-70 text-sm">{c.last}</div>
                </div>
            ))}
        </div>
    );
}