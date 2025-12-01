import { useState } from "react";
import { useAuthStore } from "@/store";
import Card from "@components/ui/Card";
import Avatar from "@components/ui/Avatar";
import Button from "@components/ui/Button";
import Icon from "@components/ui/Icon";
import Post from "@components/feed/Post";
import ProfileDetails from "@pages/profile/ProfileDetails";
import EditProfileModal from "@pages/profile/EditProfileModal";

export default function ProfilePage() {
    const [showDetails, setShowDetails] = useState(false);
    const [editOpen, setEditOpen] = useState(false);

    const user = useAuthStore((s) => s.user);
    const loading = useAuthStore((s) => s.loading);

    if (loading) {
        return <div className="p-6 text-center opacity-60">Loading profile...</div>;
    }

    if (!user) {
        return <div className="p-6 text-center opacity-60">Not authenticated</div>;
    }

    return (
        <div className="h-[calc(100vh-80px)] overflow-y-auto p-4 text-[var(--text-main)] fade-in">
            <div className="max-w-4xl mx-auto">

                <div className="flex gap-6 items-center">
                    <Avatar src={user.avatarUrl} size={110} />

                    <div className="flex flex-col gap-2">

                        <h1 className="text-3xl font-bold neon-text">{user.name}</h1>
                        <div className="opacity-70">@{user.username}</div>

                        <div className="text-sm opacity-80 flex flex-col gap-1">

                            {user.city && (
                                <div className="flex gap-2 items-center">
                                    <Icon name="map-marker-alt" className="text-[var(--primary)]" />
                                    Lives in <b className="neon-text">{user.city}</b>
                                </div>
                            )}

                            {user.education && (
                                <div className="flex gap-2 items-center">
                                    <Icon name="university" className="text-[var(--primary)]" />
                                    Studies at <b className="neon-text">{user.education}</b>
                                </div>
                            )}

                            <button
                                onClick={() => setShowDetails(v => !v)}
                                className="mt-1 text-[var(--primary)] hover:underline text-sm flex items-center gap-1"
                            >
                                <Icon name="info-circle" />
                                {showDetails ? "Hide details" : "More details"}
                            </button>

                        </div>

                        <div className="flex gap-6 mt-2">
                            <div><span className="font-bold neon-text">{user.posts.length ?? 0}</span> Posts</div>
                            <div><span className="font-bold neon-text">{user.followers.length ?? 0}</span> Followers</div>
                            <div><span className="font-bold neon-text">{user.following?.length ?? 0}</span> Following</div>
                        </div>
                    </div>
                </div>

                {showDetails && <ProfileDetails user={user} />}

                <div className="mt-6 flex gap-4 fade-in">

                    <Button
                        className="px-6 py-3 text-lg font-semibold flex items-center gap-2"
                        onClick={() => setEditOpen(true)}
                    >
                        <Icon name="user-edit" /> Edit Profile
                    </Button>

                    <Button className="px-6 py-3 text-lg font-semibold flex items-center gap-2 neon-pulse">
                        <span className="text-xl">✦</span> Add Post
                    </Button>

                </div>

                {user.bio && (
                    <Card className="mt-6 fade-in">
                        <h2 className="text-xl font-semibold neon-text mb-2">About</h2>
                        <p>{user.bio}</p>
                    </Card>
                )}

                <div className="flex flex-col gap-4 mt-6">
                    <Post />
                    <Post />
                    <Post />
                </div>
            </div>

            {editOpen && <EditProfileModal user={user} onClose={() => setEditOpen(false)} />}
        </div>
    );
}