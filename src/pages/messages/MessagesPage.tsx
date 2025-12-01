import ChatList from "@components/chat/ChatList";
import ChatWindow from "@components/chat/ChatWindow";
import ChatHeader from "@components/chat/ChatHeader";
import MessageInput from "@components/chat/MessageInput";

import { useState } from "react";

export default function MessagesPage() {
    const [activeChat, setActiveChat] = useState("John Doe");

    return (
        <div className="h-[calc(100vh-80px)] flex bg-[var(--bg-main)] text-[var(--text-main)]">

            <div className="w-72 border-r border-[var(--border-color)] h-full overflow-y-auto">
                <ChatList onSelect={setActiveChat} active={activeChat} />
            </div>

            <div className="flex-1 flex flex-col h-full">

                <ChatHeader name={activeChat} />

                <ChatWindow activeChat={activeChat} />

                <MessageInput activeChat={activeChat} />
            </div>
        </div>
    );
}