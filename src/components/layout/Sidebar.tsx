import Surface from "@components/ui/Surface";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Sidebar() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const items = [
        { label: t("sidebar.myProfile"), path: "/profile" },
        { label: t("sidebar.messages"), path: "/messages" },
        { label: t("sidebar.friends"), path: "/friends" },
        { label: t("sidebar.communities"), path: "/communities" },
        { label: t("sidebar.settings"), path: "/settings" },
    ];

    return (
        <Surface className="
            w-full 
            p-3 laptop:p-4 
            h-fit sticky 
            top-16 laptop:top-20 
            flex flex-col gap-2
        ">
            {items.map((item) => (
                <button
                    key={item.label}
                    onClick={() => navigate(item.path)}
                    className="
                        text-left 
                        p-2 rounded-lg
                        text-sm laptop:text-base
                        hover:bg-[var(--bg-main)]
                        hover:shadow-[0_0_10px_var(--primary-glow)]
                        transition-all
                    "
                >
                    {item.label}
                </button>
            ))}
        </Surface>
    );
}