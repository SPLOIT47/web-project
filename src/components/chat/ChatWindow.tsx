import { useEffect, useRef } from "react";
import { useChatStore } from "@/store/chatStore";
import ChatMessage from "./ChatMessage";
import {ServiceLocator} from "@/application/ServiceLocator";

export default function ChatWindow() {
    const activeChatId = useChatStore(s => s.activeChatId);
    const messagesMap = useChatStore(s => s.messages);
    const refreshMessages = useChatStore(s => s.refreshMessages);

    const messages = messagesMap[activeChatId!] ?? [];

    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages.length]);


    useEffect(() => {
        if (!activeChatId) return;

        const interval = setInterval(() => {
            refreshMessages(activeChatId);
        }, 2000);

        return () => clearInterval(interval);
    }, [activeChatId, refreshMessages]);

    return (
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {messages.map(m => (
                <ChatMessage key={m.id} msg={m} />
            ))}
            <div ref={bottomRef} />
        </div>
    );
}