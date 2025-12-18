import { Outlet } from "react-router-dom";
import CommunityRightSidebar from "@components/rightbar/CommunityRightSidebar";
import { useCommunityPageStore } from "@/store/communityPageStore";
import {useModalStore} from "@/store/modalStore";

export default function CommunityLayout() {
    const community = useCommunityPageStore(s => s.community);
    const openDetails = useModalStore(s => s.openCommunityDetails);
    const openFollowers = useModalStore(s => s.openCommunityFollowers);

    return (
        <div className="flex h-full gap-6">

            <main className="flex-1 min-w-0 overflow-y-auto">
                <Outlet />
            </main>

            {community && (
                <aside className="hidden xl:block w-64 shrink-0">
                    <CommunityRightSidebar
                        community={community}
                    />
                </aside>
            )}
        </div>
    );
}