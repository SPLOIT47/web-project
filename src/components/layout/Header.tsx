import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@components/ui/Icon";

export default function Header() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header
            className="
                fixed top-0 left-0 right-0 z-50
                h-16 flex items-center justify-between
                px-6
                bg-[var(--bg-surface)]
                border-b border-[var(--border-color)]
                shadow-[0_0_12px_var(--primary-glow)]
            "
        >
            <div
                className="text-xl font-bold neon-text cursor-pointer"
                onClick={() => navigate("/home")}
            >
                SocialNetwork
            </div>

            <input
                type="text"
                placeholder="Search..."
                className="
                    bg-[var(--bg-main)]
                    border border-[var(--border-color)]
                    px-4 py-1.5 rounded-lg
                    focus:ring-2 focus:ring-[var(--primary)]
                    shadow-sm transition-all hidden sm:block
                    w-1/2
                "
            />

            <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="
                    p-2 rounded-lg
                    border border-[var(--border-color)]
                    shadow-[0_0_10px_var(--primary-glow)]
                    hover:shadow-[0_0_18px_var(--primary-glow)]
                    transition-all
                    neon-text
                "
            >
                <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2"
                     strokeLinecap="round" strokeLinejoin="round">
                    <line x1="4" y1="7" x2="22" y2="7" />
                    <line x1="4" y1="13" x2="22" y2="13" />
                    <line x1="4" y1="19" x2="22" y2="19" />
                </svg>
            </button>

            {menuOpen && (
                <div
                    className="
            absolute right-6 top-[70px] w-44
            neon-surface p-3 rounded-xl
            flex flex-col gap-2
            animate-fade-in
        "
                >
                    <button onClick={() => navigate("/home")} className="flex items-center gap-2 neon-text-hover text-left">
                        <Icon name="home" /> Home
                    </button>

                    <button onClick={() => navigate("/messages")} className="flex items-center gap-2 neon-text-hover text-left">
                        <Icon name="envelope" /> Messages
                    </button>

                    <button onClick={() => navigate("/profile")} className="flex items-center gap-2 neon-text-hover text-left">
                        <Icon name="user" /> Profile
                    </button>

                    <button onClick={() => navigate("/settings")} className="flex items-center gap-2 neon-text-hover text-left">
                        <Icon name="cog" /> Settings
                    </button>

                    <div className="h-px bg-[var(--border-color)]"></div>

                    <button className="flex items-center gap-2 text-red-400 hover:text-red-300 text-left">
                        <Icon name="sign-out-alt" /> Logout
                    </button>
                </div>
            )}
        </header>
    );
}