import { useState } from "react";
import Button from "@components/ui/Button";

export default function MessageInput() {
    const [filePreview, setFilePreview] = useState<string | null>(null);

    return (
        <div className="flex gap-3 items-center">

            <label className="cursor-pointer neon-text-hover">
                📎
                <input type="file" className="hidden"
                       onChange={(e) => {
                           const file = e.target.files?.[0];
                           if (file) setFilePreview(URL.createObjectURL(file));
                       }}
                />
            </label>

            <button className="text-2xl neon-text-hover">🎤</button>

            <input
                className="
                    flex-1 bg-[var(--bg-surface)]
                    border border-[var(--border-color)]
                    p-3 rounded-xl shadow-sm
                    focus:ring-2 focus:ring-[var(--primary)]
                    transition-all
                "
                placeholder="Type a message..."
            />

            <Button className="px-6 neon-pulse">Send</Button>

        </div>
    );
}