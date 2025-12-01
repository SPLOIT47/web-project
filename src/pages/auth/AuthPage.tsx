import { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { ThemeContext } from "@context/ThemeContext";
import { LanguageContext } from "@context/LanguageContext";
import { useAuthStore } from "@/store";

export default function AuthPage() {
    const { t } = useTranslation();
    const { toggleTheme } = useContext(ThemeContext);
    const { switchLang } = useContext(LanguageContext);

    const navigate = useNavigate();

    const loginFn = useAuthStore((s) => s.login);
    const registerFn = useAuthStore((s) => s.register);
    const loading = useAuthStore((s) => s.loading);
    const error = useAuthStore((s) => s.error);

    const [isRightPanelActive, setIsRightPanelActive] = useState(false);

    const [regName, setRegName] = useState("");
    const [regEmail, setRegEmail] = useState("");
    const [regPass, setRegPass] = useState("");

    const [logEmail, setLogEmail] = useState("");
    const [logPass, setLogPass] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const ok = await loginFn({ username: logEmail, password: logPass });
        if (ok) navigate("/home");
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        const ok = await registerFn({
            username: regEmail,
            name: regName,
            password: regPass,
        });
        if (ok) navigate("/home");
    };

    return (
        <div className="auth-wrapper hitech-bg bg-[var(--bg-main)] text-[var(--text-main)]">
            <div className={`auth-container ${isRightPanelActive ? "right-panel-active" : ""}`}>
                <div className="form-container sign-up-container">
                    <form onSubmit={handleRegister}>
                        <h1 className="auth-title">{t("auth.register")}</h1>

                        <input value={regName} onChange={(e) => setRegName(e.target.value)} type="text" placeholder={t("auth.fullName") || "Full Name"} />
                        <input value={regEmail} onChange={(e) => setRegEmail(e.target.value)} type="email" placeholder={t("auth.email")} />
                        <input value={regPass} onChange={(e) => setRegPass(e.target.value)} type="password" placeholder={t("auth.password")} />

                        {isRightPanelActive && error && (
                            <p className="text-red-400 text-sm mt-1">{error}</p>
                        )}

                        <button disabled={loading} className="neon-btn auth-btn">
                            {loading ? "..." : t("auth.register")}
                        </button>
                    </form>
                </div>

                <div className="form-container sign-in-container">
                    <form onSubmit={handleLogin}>
                        <h1 className="auth-title">{t("auth.login")}</h1>

                        <input value={logEmail} onChange={(e) => setLogEmail(e.target.value)} type="email" placeholder={t("auth.email")} />
                        <input value={logPass} onChange={(e) => setLogPass(e.target.value)} type="password" placeholder={t("auth.password")} />

                        {!isRightPanelActive && error && (
                            <p className="text-red-400 text-sm mt-1">{error}</p>
                        )}

                        <button disabled={loading} className="neon-btn auth-btn">
                            {loading ? "..." : t("auth.login")}
                        </button>
                    </form>
                </div>

                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <h1 className="overlay-title">{t("auth.welcomeBack")}</h1>
                            <p>{t("auth.welcomeBackDesc")}</p>

                            <button className="ghost" onClick={() => setIsRightPanelActive(false)}>
                                {t("auth.login")}
                            </button>
                        </div>

                        <div className="overlay-panel overlay-right">
                            <h1 className="overlay-title">{t("auth.helloFriend")}</h1>
                            <p>{t("auth.helloFriendDesc")}</p>

                            <button className="ghost" onClick={() => setIsRightPanelActive(true)}>
                                {t("auth.register")}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="auth-controls">
                    <button onClick={() => switchLang("ru")}>RU</button>
                    <button onClick={() => switchLang("en")}>EN</button>
                    <button onClick={toggleTheme}>🌓</button>
                </div>

            </div>
        </div>
    );
}