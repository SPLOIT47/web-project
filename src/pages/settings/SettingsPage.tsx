import Card from "@components/ui/Card";
import Input from "@components/ui/Input";
import Button from "@components/ui/Button";
import Divider from "@components/ui/Divider";
import { useContext } from "react";
import { ThemeContext } from "@context/ThemeContext";
import { LanguageContext } from "@context/LanguageContext";

export default function SettingsPage() {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { lang, switchLang } = useContext(LanguageContext);

    return (
        <div className="h-[calc(100vh-80px)] overflow-y-auto bg-[var(--bg-main)] text-[var(--text-main)] p-6 hitech-bg">
            <div className="max-w-4xl mx-auto flex flex-col gap-6">

                <h1 className="text-3xl font-bold neon-text mb-2">
                    Settings
                </h1>

                <Card className="flex flex-col gap-4">
                    <h2 className="text-xl font-semibold neon-text">Profile Settings</h2>
                    <Divider />
                    <Input placeholder="Your Name" />
                    <Input placeholder="Username" />
                    <Input placeholder="Email" type="email" />
                    <Button className="w-fit mt-2">Save Changes</Button>
                </Card>

                <Card className="flex flex-col gap-4">
                    <h2 className="text-xl font-semibold neon-text">Security</h2>
                    <Divider />
                    <Input placeholder="Current Password" type="password" />
                    <Input placeholder="New Password" type="password" />
                    <Input placeholder="Repeat New Password" type="password" />
                    <Button className="w-fit">Change Password</Button>
                </Card>

                <Card className="flex flex-col gap-4">
                    <h2 className="text-xl font-semibold neon-text">Appearance</h2>
                    <Divider />

                    <div className="flex items-center justify-between">
                        <span>Theme</span>
                        <Button className="px-4" onClick={toggleTheme}>
                            Toggle Theme ({theme})
                        </Button>
                    </div>
                </Card>

                <Card className="flex flex-col gap-4">
                    <h2 className="text-xl font-semibold neon-text">Language</h2>
                    <Divider />

                    <div className="flex items-center gap-4">
                        <Button
                            className={lang === "en" ? "" : "opacity-70"}
                            onClick={() => switchLang("en")}
                        >
                            English
                        </Button>
                        <Button
                            className={lang === "ru" ? "" : "opacity-70"}
                            onClick={() => switchLang("ru")}
                        >
                            Русский
                        </Button>
                    </div>
                </Card>

                <Card className="flex flex-col gap-4 border-red-500">
                    <h2 className="text-xl font-semibold neon-text">Account</h2>
                    <Divider />
                    <Button className="w-fit bg-red-600 hover:bg-red-700">Logout</Button>
                    <Button className="w-fit bg-red-700 hover:bg-red-800">Delete Account</Button>
                </Card>

            </div>
        </div>
    );
}