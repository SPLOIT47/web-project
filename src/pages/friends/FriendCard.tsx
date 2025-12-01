import Button from "@components/ui/Button";

export default function FriendCard({
                                       user,
                                       type,
                                   }: {
    user: any;
    type: "friend" | "request" | "outgoing";
}) {
    return (
        <div
            className="
                p-4 rounded-xl border border-[var(--border-color)]
                bg-[var(--bg-surface)]
                shadow-[0_0_12px_var(--primary-glow)]
                hover:shadow-[0_0_18px_var(--primary-glow)]
                transition-all flex items-center gap-4 fade-in
            "
        >
            <div className="relative">
                <img
                    src={user.avatar}
                    className="w-16 h-16 rounded-full border border-[var(--border-color)]"
                />

                {user.online && (
                    <span className="
                        absolute bottom-0 right-0 w-4 h-4 rounded-full
                        bg-green-500 shadow-[0_0_6px_rgba(0,255,0,.8)]
                    "></span>
                )}
            </div>

            <div className="flex-1">
                <div className="text-lg font-semibold neon-text">
                    {user.name}
                </div>

                {type === "friend" && (
                    <div className="text-sm opacity-70">
                        {user.online ? "Online" : "Offline"}
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-2">
                {type === "friend" && (
                    <>
                        <Button className="px-4">Message</Button>
                        <Button className="px-4 bg-red-600 hover:bg-red-700">
                            Remove
                        </Button>
                    </>
                )}

                {type === "request" && (
                    <>
                        <Button className="px-4">Accept</Button>
                        <Button className="px-4 bg-red-600 hover:bg-red-700">
                            Decline
                        </Button>
                    </>
                )}

                {type === "outgoing" && (
                    <Button className="px-4 bg-red-600 hover:bg-red-700">
                        Cancel
                    </Button>
                )}
            </div>
        </div>
    );
}