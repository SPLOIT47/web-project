import { useParams } from "react-router-dom";
import CommunityHeader from "@components/community/CommunityHeader";
import Card from "@components/ui/Card";
import Post from "@components/feed/Post";
import Button from "@components/ui/Button";

export default function CommunityPage() {
    const { id } = useParams();

    return (
        <div className="h-[calc(100vh-80px)] overflow-y-auto text-[var(--text-main)] fade-in">

            <CommunityHeader />

            <div className="max-w-4xl mx-auto p-6">

                <Card className="mb-6">
                    <h2 className="text-xl font-semibold neon-text mb-2">
                        About Community
                    </h2>
                    <p className="opacity-80">
                        This is a futuristic neon community about UI/UX design,
                        animations, creative coding and building modern interfaces.
                    </p>
                </Card>

                <div className="flex gap-4 mb-6">
                    <Button>Join Community</Button>
                    <Button>Message Admin</Button>
                </div>

                <div className="flex flex-col gap-4">
                    <Post />
                    <Post />
                    <Post />
                </div>

            </div>
        </div>
    );
}