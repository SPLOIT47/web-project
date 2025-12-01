import Icon from "@components/ui/Icon";

export default function CommunityHeader() {
    return (
        <div className="w-full h-60 relative">

            <div
                className="
                    absolute inset-0
                    bg-gradient-to-r from-pink-700 to-purple-700
                    opacity-80
                    hitech-bg
                "
            ></div>

            <div className="absolute inset-0 bg-black/40"></div>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-6 flex gap-6 items-end">

                <img
                    src="https://picsum.photos/300?community"
                    className="
                        w-32 h-32 rounded-xl object-cover
                        border-4 border-[var(--bg-surface)]
                        shadow-[0_0_15px_var(--primary-glow)]
                    "
                />

                <div className="text-white flex flex-col gap-1 pb-2">
                    <h1 className="text-3xl font-bold drop-shadow-xl">
                        Neon UI Designers
                    </h1>

                    <div className="text-sm opacity-80">
                        12.4k members · Public Community
                    </div>

                    <div className="flex gap-4 mt-2">
                        <div className="flex gap-1 items-center">
                            <Icon name="user-friends" className="text-pink-300" />
                            <span>12.4k members</span>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    );
}