import Card from "@components/ui/Card";
import Input from "@components/ui/Input";
import Button from "@components/ui/Button";
import Divider from "@components/ui/Divider";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "@context/ThemeContext";
import { LanguageContext } from "@context/LanguageContext";
import {useAuthStore} from "@/store";
import {useNavigate} from "react-router-dom";

export default function SettingsPage() {
    const { t } = useTranslation();
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { lang, switchLang } = useContext(LanguageContext);

    const logout = useAuthStore(s => s.logout);
    const deleteAccount = useAuthStore(s => s.deleteAccount);
    const navigate = useNavigate();

    return (
        <div className="h-[calc(100vh-80px)] overflow-y-auto bg-[var(--bg-main)] text-[var(--text-main)] p-6 hitech-bg">
            <div className="max-w-4xl mx-auto flex flex-col gap-6">

                <h1 className="text-3xl font-bold neon-text mb-2">
                    {t("settings.title")}
                </h1>

                <Card className="flex flex-col gap-4">
                    <h2 className="text-xl font-semibold neon-text">{t("settings.profileSettings")}</h2>
                    <Divider />
                    <Input placeholder={t("settings.yourName")} />
                    <Input placeholder={t("settings.username")} />
                    <Input placeholder={t("settings.email")} type="email" />
                    <Button className="w-fit mt-2">{t("settings.saveChanges")}</Button>
                </Card>

                <Card className="flex flex-col gap-4">
                    <h2 className="text-xl font-semibold neon-text">{t("settings.security")}</h2>
                    <Divider />
                    <Input placeholder={t("settings.currentPassword")} type="password" />
                    <Input placeholder={t("settings.newPassword")} type="password" />
                    <Input placeholder={t("settings.repeatNewPassword")} type="password" />
                    <Button className="w-fit">{t("settings.changePassword")}</Button>
                </Card>

                <Card className="flex flex-col gap-4">
                    <h2 className="text-xl font-semibold neon-text">{t("settings.appearance")}</h2>
                    <Divider />

                    <div className="flex items-center justify-between">
                        <span>{t("settings.theme")}</span>
                        <Button className="px-4" onClick={toggleTheme}>
                            {t("settings.toggleTheme", { theme })}
                        </Button>
                    </div>
                </Card>

                <Card className="flex flex-col gap-4">
                    <h2 className="text-xl font-semibold neon-text">{t("settings.language")}</h2>
                    <Divider />

                    <div className="flex items-center gap-4">
                        <Button
                            className={lang === "en" ? "" : "opacity-70"}
                            onClick={() => switchLang("en")}
                        >
                            {t("settings.english")}
                        </Button>
                        <Button
                            className={lang === "ru" ? "" : "opacity-70"}
                            onClick={() => switchLang("ru")}
                        >
                            {t("settings.russian")}
                        </Button>
                    </div>
                </Card>

                <Card className="flex flex-col gap-4 border-red-500">
                    <h2 className="text-xl font-semibold neon-text">{t("settings.account")}</h2>
                    <Divider />
                    <Button
                        className="w-fit bg-red-600 hover:bg-red-700"
                        onClick={() => {
                            logout();
                            navigate("/");
                        }}
                    >
                        {t("settings.logout")}
                    </Button>

                    <Button
                        className="w-fit bg-red-700 hover:bg-red-800"
                        onClick={async () => {
                            if (!confirm(t("settings.confirmDelete"))) return;

                            await deleteAccount();
                            navigate("/");
                        }}
                    >
                        {t("settings.deleteAccount")}
                    </Button>
                </Card>

            </div>
        </div>
    );
}