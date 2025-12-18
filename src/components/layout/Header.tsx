import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Icon from "@components/ui/Icon";
import {useAuthStore} from "@/store";

export default function Header() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const logout = useAuthStore(s => s.logout);

    const go = (path: string) => {
        setMenuOpen(false);
        navigate(path);
    };

    return (
        <header
            className="
                fixed top-0 left-0 right-0 z-50
                h-14 tablet:h-16
                flex items-center justify-between
                px-3 mobile:px-4 tablet:px-6
                bg-[var(--bg-surface)]
                border-b border-[var(--border-color)]
                shadow-[0_0_12px_var(--primary-glow)]
            "
        >
            <div
                className="text-lg mobile:text-xl font-bold neon-text cursor-pointer"
                onClick={() => navigate("/home")}
            >
                {t("app.name")}
            </div>

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
            absolute right-3 mobile:right-4 tablet:right-6 
            top-[58px] tablet:top-[70px] 
            w-40 mobile:w-44
            neon-surface p-3 rounded-xl
            flex flex-col gap-2
            animate-fade-in z-50
        "
                >
                    <button onClick={() => go("/home")} className="flex items-center gap-2 neon-text-hover text-left">
                        <Icon name="home" /> {t("header.home")}
                    </button>

                    <button onClick={() => go("/messages")} className="flex items-center gap-2 neon-text-hover text-left">
                        <Icon name="envelope" /> {t("header.messages")}
                    </button>

                    <button
                        onClick={() => go("/communities")}
                        className="flex items-center gap-2 neon-text-hover text-left"
                    >
                        <Icon name="users" /> {t("header.communities")}
                    </button>

                    <button onClick={() => go("/profile")} className="flex items-center gap-2 neon-text-hover text-left">
                        <Icon name="user" /> {t("header.profile")}
                    </button>

                    <button onClick={() => go("/settings")} className="flex items-center gap-2 neon-text-hover text-left">
                        <Icon name="cog" /> {t("header.settings")}
                    </button>

                    <div className="h-px bg-[var(--border-color)]"></div>

                    <button
                        className="flex items-center gap-2 text-red-400 hover:text-red-300 text-left"
                        onClick={() => {
                            logout();
                            navigate("/");
                        }}
                    >
                        <Icon name="sign-out-alt" /> {t("header.logout")}
                    </button>
                </div>
            )}
        </header>
    );
}