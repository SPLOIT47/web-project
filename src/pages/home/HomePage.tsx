import Header from "@components/layout/Header";
import Sidebar from "@components/layout/Sidebar";
import RightSidebar from "@components/rightbar/RightSidebar";
import CreatePost from "@components/feed/CreatePost";
import Post from "@components/feed/Post";

export default function HomePage() {
    return (
        <div className="h-screen overflow-hidden bg-[var(--bg-main)] text-[var(--text-main)] hitech-bg">
            <div className="pt-20 max-w-7xl mx-auto px-4 flex gap-6">

                <div className="hidden lg:block w-56 sticky top-20 h-[calc(100vh-5rem)]">
                    <Sidebar />
                </div>

                <main
                    className="
                        flex-1 max-w-2xl mx-auto
                        h-[calc(100vh-5rem)]
                        overflow-y-auto
                        flex flex-col gap-4 pb-10
                        pr-2
                    "
                >
                    <CreatePost />
                    <Post />
                    <Post />
                    <Post />
                    <Post />
                    <Post />
                    <Post />
                </main>

                <div className="hidden xl:block w-64 sticky top-20 h-[calc(100vh-5rem)]">
                    <RightSidebar />
                </div>

            </div>
        </div>
    );
}