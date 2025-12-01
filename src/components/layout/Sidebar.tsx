import Surface from "@components/ui/Surface";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
    const navigate = useNavigate();

    const items = [
        { label: "My Profile", path: "/profile" },
        { label: "Messages", path: "/messages" },
        { label: "Friends", path: "/friends" },
        { label: "Communities", path: "/community" },
        { label: "Photos", path: "/photos" },
        { label: "Settings", path: "/settings" },
    ];

    return (
        <Surface className="w-56 p-4 h-fit sticky top-20 flex flex-col gap-2">
            {items.map((item) => (
                <button
                    key={item.label}
                    onClick={() => navigate(item.path)}
                    className="
                        text-left p-2 rounded-lg
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