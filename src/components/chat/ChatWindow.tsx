import { useEffect, useRef, useState } from "react";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";

export default function ChatWindow({ activeChat }: { activeChat: string }) {
    const [messages, setMessages] = useState([
        { from: "other", text: "Hey there! 👋", time: "11:24", status: "read" },
        { from: "me", text: "Hello!", time: "11:25", status: "delivered" },
        { from: "other", text: "How's your day?", time: "11:26", status: "read" },
        { from: "me", text: "Pretty good!", time: "11:27", status: "sent" },
    ]);

    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">

            {messages.map((m, index) => (
                <ChatMessage key={index} msg={m} />
            ))}

            <TypingIndicator name={activeChat} />

            <div ref={bottomRef}></div>
        </div>
    );
}