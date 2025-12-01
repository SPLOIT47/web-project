export default function ChatHeader({ name }: { name: string }) {
    return (
        <div className="
            p-4 border-b border-[var(--border-color)]
            flex items-center gap-3
        ">
            <div className="relative">
                <img
                    src="https://picsum.photos/60"
                    className="w-12 h-12 rounded-full border border-[var(--border-color)] shadow-[0_0_10px_var(--primary-glow)]"
                />
                <span className="
                    absolute bottom-0 right-0 w-3 h-3 rounded-full
                    bg-green-500 shadow-[0_0_6px_rgba(0,255,0,0.6)]
                "></span>
            </div>

            <div>
                <div className="text-lg font-bold neon-text-hover">{name}</div>
                <div className="text-sm opacity-70">online</div>
            </div>
        </div>
    );
}