import {
    useContext,
    useEffect,
    useState,
    type FormEvent,
} from "react";
import Card from "@components/ui/Card";
import Input from "@components/ui/Input";
import Button from "@components/ui/Button";
import Divider from "@components/ui/Divider";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "@context/ThemeContext";
import { LanguageContext } from "@context/LanguageContext";
import { useAuthStore } from "@/store";
import { useNavigate } from "react-router-dom";
import { ServiceLocator } from "@/application/ServiceLocator";
import { HttpError } from "@/infrastructure/http/httpClient";

export default function SettingsPage() {
    const { t } = useTranslation();
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { lang, switchLang } = useContext(LanguageContext);

    const user = useAuthStore(s => s.user);
    const logout = useAuthStore(s => s.logout);
    const deleteAccount = useAuthStore(s => s.deleteAccount);
    const patchUser = useAuthStore(s => s.patchUser);
    const navigate = useNavigate();

    const [login, setLogin] = useState("");
    const [email, setEmail] = useState("");
    const [profileSaving, setProfileSaving] = useState(false);
    const [profileError, setProfileError] = useState<string | null>(null);
    const [profileOk, setProfileOk] = useState(false);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [passwordSaving, setPasswordSaving] = useState(false);
    const [passwordError, setPasswordError] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            setLogin(user.username ?? "");
            setEmail(user.email ?? "");
        }
    }, [user]);

    const handleSaveProfile = async (e: FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setProfileSaving(true);
        setProfileError(null);
        setProfileOk(false);
        try {
            const authPayload: {
                login?: string;
                email?: string;
            } = {};
            if (login.trim() !== user.username) {
                authPayload.login = login.trim();
            }
            if (email.trim() !== user.email) {
                authPayload.email = email.trim();
            }

            if (Object.keys(authPayload).length === 0) {
                setProfileError(t("settings.nothingToSave"));
                return;
            }

            const res =
                await ServiceLocator.authService.updateCredentials(
                    authPayload,
                );
            patchUser({
                username: res.login,
                email: res.email,
            });

            setProfileOk(true);
            setTimeout(() => setProfileOk(false), 4000);
        } catch (err) {
            const msg =
                err instanceof HttpError
                    ? err.message
                    : t("settings.saveError");
            setProfileError(msg);
        } finally {
            setProfileSaving(false);
        }
    };

    const handleChangePassword = async (e: FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setPasswordError(null);

        if (!currentPassword.trim() || !newPassword.trim()) {
            setPasswordError(t("settings.fillPasswordFields"));
            return;
        }
        if (newPassword !== repeatPassword) {
            setPasswordError(t("settings.passwordMismatch"));
            return;
        }

        setPasswordSaving(true);
        try {
            await ServiceLocator.authService.updateCredentials({
                currentPassword,
                newPassword,
            });
            setCurrentPassword("");
            setNewPassword("");
            setRepeatPassword("");
            await logout();
            alert(t("settings.passwordChangedRelogin"));
            navigate("/");
        } catch (err) {
            const msg =
                err instanceof HttpError
                    ? err.message
                    : t("settings.passwordChangeError");
            setPasswordError(msg);
        } finally {
            setPasswordSaving(false);
        }
    };

    if (!user) {
        return (
            <div className="h-[calc(100vh-80px)] overflow-y-auto p-6 opacity-70">
                {t("profile.notAuthenticated")}
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-80px)] overflow-y-auto bg-[var(--bg-main)] text-[var(--text-main)] p-6 hitech-bg">
            <div className="max-w-4xl mx-auto flex flex-col gap-6">
                <h1 className="text-3xl font-bold neon-text mb-2">
                    {t("settings.title")}
                </h1>

                <form onSubmit={handleSaveProfile}>
                    <Card className="flex flex-col gap-4">
                        <h2 className="text-xl font-semibold neon-text">
                            {t("settings.profileSettings")}
                        </h2>
                        <Divider />
                        <Input
                            value={login}
                            onChange={e => setLogin(e.target.value)}
                            placeholder={t("settings.username")}
                        />
                        <Input
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder={t("settings.email")}
                            type="email"
                        />
                        {profileError && (
                            <p className="text-red-400 text-sm">{profileError}</p>
                        )}
                        {profileOk && (
                            <p className="text-green-400 text-sm">
                                {t("settings.saveSuccess")}
                            </p>
                        )}
                        <Button
                            type="submit"
                            className="w-fit mt-2"
                            disabled={profileSaving}
                        >
                            {profileSaving
                                ? t("settings.saving")
                                : t("settings.saveChanges")}
                        </Button>
                    </Card>
                </form>

                <form onSubmit={handleChangePassword}>
                    <Card className="flex flex-col gap-4">
                        <h2 className="text-xl font-semibold neon-text">
                            {t("settings.security")}
                        </h2>
                        <Divider />
                        <Input
                            value={currentPassword}
                            onChange={e => setCurrentPassword(e.target.value)}
                            placeholder={t("settings.currentPassword")}
                            type="password"
                            autoComplete="current-password"
                        />
                        <Input
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            placeholder={t("settings.newPassword")}
                            type="password"
                            autoComplete="new-password"
                        />
                        <Input
                            value={repeatPassword}
                            onChange={e => setRepeatPassword(e.target.value)}
                            placeholder={t("settings.repeatNewPassword")}
                            type="password"
                            autoComplete="new-password"
                        />
                        {passwordError && (
                            <p className="text-red-400 text-sm">{passwordError}</p>
                        )}
                        <Button
                            type="submit"
                            className="w-fit"
                            disabled={passwordSaving}
                        >
                            {passwordSaving
                                ? t("settings.saving")
                                : t("settings.changePassword")}
                        </Button>
                    </Card>
                </form>

                <Card className="flex flex-col gap-4">
                    <h2 className="text-xl font-semibold neon-text">
                        {t("settings.appearance")}
                    </h2>
                    <Divider />

                    <div className="flex items-center justify-between">
                        <span>{t("settings.theme")}</span>
                        <Button
                            type="button"
                            className="px-4"
                            onClick={toggleTheme}
                        >
                            {t("settings.toggleTheme", { theme })}
                        </Button>
                    </div>
                </Card>

                <Card className="flex flex-col gap-4">
                    <h2 className="text-xl font-semibold neon-text">
                        {t("settings.language")}
                    </h2>
                    <Divider />

                    <div className="flex items-center gap-4">
                        <Button
                            type="button"
                            className={lang === "en" ? "" : "opacity-70"}
                            onClick={() => switchLang("en")}
                        >
                            {t("settings.english")}
                        </Button>
                        <Button
                            type="button"
                            className={lang === "ru" ? "" : "opacity-70"}
                            onClick={() => switchLang("ru")}
                        >
                            {t("settings.russian")}
                        </Button>
                    </div>
                </Card>

                <Card className="flex flex-col gap-4 border-red-500">
                    <h2 className="text-xl font-semibold neon-text">
                        {t("settings.account")}
                    </h2>
                    <Divider />
                    <Button
                        type="button"
                        className="w-fit bg-red-600 hover:bg-red-700"
                        onClick={async () => {
                            await logout();
                            navigate("/");
                        }}
                    >
                        {t("settings.logout")}
                    </Button>

                    <Button
                        type="button"
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
