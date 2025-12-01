export default function TypingIndicator({ name }: { name: string }) {
    return (
        <div className="flex items-center gap-2 fade-in opacity-80">
            <div className="flex items-center">
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
            </div>
            <span className="text-xs">{name} is typing…</span>
        </div>
    );
}