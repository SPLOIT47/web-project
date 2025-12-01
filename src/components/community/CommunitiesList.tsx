import CommunityCard from "./CommunityCard";

export default function CommunitiesList({ tab }: { tab: string }) {

    const all = [
        {
            id: 2,
            name: "JS Developers",
            members: "56k",
            description: "We love JavaScript and TypeScript",
            image: "https://picsum.photos/300?jsdev",
        }
    ];

    const my = [
        {
            id: 10,
            name: "My Cool Community",
            members: "1.2k",
            description: "Content I follow",
            image: "https://picsum.photos/300?my",
        }
    ];

    const manage = [
        {
            id: 3,
            name: "My Personal Community",
            members: "412",
            description: "Admin panel and moderation",
            image: "https://picsum.photos/200?admin",
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-2 fade-in">

            {tab === "all" &&
                all.map(c => (
                    <CommunityCard key={c.id} community={c} type="all" />
                ))}

            {tab === "my" &&
                my.map(c => (
                    <CommunityCard key={c.id} community={c} type="my" />
                ))}

            {tab === "manage" &&
                manage.map(c => (
                    <CommunityCard key={c.id} community={c} type="manage" />
                ))}

            {tab === "search" && (
                <div className="w-full">
                    <input
                        placeholder="Search communities..."
                        className="
                            w-full bg-[var(--bg-surface)]
                            border border-[var(--border-color)]
                            p-3 rounded-xl shadow-sm
                            focus:ring-2 focus:ring-[var(--primary)]
                            transition-all
                        "
                    />
                </div>
            )}

        </div>
    );
}