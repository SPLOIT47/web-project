import type { Community } from "@/domain/community/Community";
import Icon from "@components/ui/Icon";

type Props = {
    community: Community;
};

export default function CommunityHeader({ community }: Props) {
    return (
        <div className="w-full h-40 mobile:h-48 tablet:h-56 laptop:h-60 relative">

            <div
                className="absolute inset-0 bg-gradient-to-r from-pink-700 to-purple-700 opacity-80 hitech-bg"
            />

            <div className="absolute inset-0 bg-black/40" />

            <div className="
                absolute bottom-2 mobile:bottom-4 
                left-1/2 -translate-x-1/2 
                w-full max-w-full mobile:max-w-4xl 
                px-3 mobile:px-4 tablet:px-6 
                flex gap-3 mobile:gap-4 tablet:gap-6 
                items-end
            ">

                <img
                    src={community.avatarUrl}
                    className="
                        w-16 h-16 mobile:w-24 mobile:h-24 tablet:w-32 tablet:h-32
                        rounded-xl object-cover
                        border-2 mobile:border-4 border-[var(--bg-surface)]
                        shadow-[0_0_15px_var(--primary-glow)]
                        shrink-0
                    "
                />

                <div className="text-white flex flex-col gap-1 pb-1 mobile:pb-2 min-w-0 flex-1">
                    <h1 className="
                        text-lg mobile:text-2xl tablet:text-3xl 
                        font-bold drop-shadow-xl
                        truncate
                    ">
                        {community.name}
                    </h1>

                    <div className="text-xs mobile:text-sm opacity-80">
                        {community.followers.length} members · {community.type}
                    </div>

                    <div className="flex gap-2 mobile:gap-4 mt-1 mobile:mt-2">
                        <div className="flex gap-1 items-center text-xs mobile:text-sm">
                            <Icon name="user-friends" className="text-pink-300" />
                            <span>{community.followers.length} members</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}