import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";

import { useAuthStore } from "@/store/authStore";
import { useProfileStore } from "@/store/profileStore";
import { useFriendsStore } from "@/store/friendsStore";
import { useChatStore } from "@/store/chatStore";
import { useModalStore } from "@/store/modalStore";

import Card from "@components/ui/Card";
import Button from "@components/ui/Button";
import Icon from "@components/ui/Icon";
import AvatarUploader from "@components/ui/AvatarUploader";
import Post from "@components/feed/Post";
import PostEditor from "@components/post/PostEditor";

import ProfileDetails from "./ProfileDetails";
import { getUserDisplayName } from "@/presentation/user/userDisplayName";
import type { PostAuthor } from "@/domain/post/PostAuthor";
import type { Post } from "@/domain/post/Post";
import { ServiceLocator } from "@/application/ServiceLocator";
import type { FriendRelation } from "@/domain/friend/FriendRelation";
import { useUserStore } from "@/store/userStore";
import { isUuidString } from "@/utils/uuid";

export default function ProfilePage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams<{ id?: string }>();

    const authUser = useAuthStore(s => s.user);
    const isMe = !id || id === authUser?.id;

    const [showDetails, setShowDetails] = useState(false);
    const [showPostEditor, setShowPostEditor] = useState(false);

    const {
        user,
        loading: profileLoading,
        loadProfile,
        updateProfile,
    } = useProfileStore();

    const [profilePosts, setProfilePosts] = useState<Post[]>([]);
    const [postsLoading, setPostsLoading] = useState(false);
    const upsertUsers = useUserStore(s => s.upsertMany);

    const reloadProfilePosts = useCallback(async (forUserId: string) => {
        setPostsLoading(true);
        try {
            const list = await ServiceLocator.postService.getByAuthor({
                type: "user",
                userId: forUserId,
            });
            const commentAuthorIds = [
                ...new Set(
                    list
                        .flatMap(post => post.comments.map(c => c.authorId))
                        .filter(
                            id =>
                                id &&
                                id !== forUserId &&
                                isUuidString(id),
                        ),
                ),
            ];
            if (commentAuthorIds.length > 0) {
                const users = await ServiceLocator.userService.getBatch(
                    commentAuthorIds,
                );
                if (users.length > 0) {
                    upsertUsers(users);
                }
            }
            setProfilePosts(list);
        } catch (e) {
            console.error(e);
            setProfilePosts([]);
        } finally {
            setPostsLoading(false);
        }
    }, [upsertUsers]);

    const {
        getRelation,
        sendRequest,
        accept,
        decline,
        cancel,
        remove,
    } = useFriendsStore();

    const { openEditProfile } = useModalStore();

    const openOrCreatePrivateChat =
        useChatStore(s => s.openOrCreatePrivateChat);

    const posts = profilePosts;

    useEffect(() => {
        if (!authUser) return;

        const targetId = isMe ? authUser.id : id!;
        loadProfile(targetId);
    }, [id, authUser, isMe, loadProfile]);

    useEffect(() => {
        if (!user?.id) return;
        void reloadProfilePosts(user.id);
    }, [user?.id, reloadProfilePosts]);

    const [profileRelation, setProfileRelation] =
        useState<FriendRelation | null>(null);
    const [friendsCount, setFriendsCount] = useState<number | null>(null);

    const refreshFriendsCount = useCallback(async () => {
        if (!user?.id) return;
        try {
            const n = await ServiceLocator.userService.getFriendCountForUser(
                user.id,
            );
            setFriendsCount(n);
        } catch {}
    }, [user?.id]);

    const refreshRelation = useCallback(async () => {
        if (!authUser?.id || !user?.id || isMe) return;
        const r = await ServiceLocator.userService.getFriendRelation(
            authUser.id,
            user.id,
        );
        setProfileRelation(r);
    }, [authUser?.id, user?.id, isMe]);

    useEffect(() => {
        if (!authUser?.id || !user?.id) return;

        let cancelled = false;
        setFriendsCount(null);
        void ServiceLocator.userService
            .getFriendCountForUser(user.id)
            .then(n => {
                if (!cancelled) setFriendsCount(n);
            })
            .catch(() => {
                if (!cancelled) setFriendsCount(null);
            });
        return () => {
            cancelled = true;
        };
    }, [authUser?.id, user?.id]);

    useEffect(() => {
        if (!authUser?.id || !user?.id) return;

        if (isMe) {
            setProfileRelation(null);
            return;
        }

        let cancelled = false;
        ServiceLocator.userService
            .getFriendRelation(authUser.id, user.id)
            .then(r => {
                if (!cancelled) setProfileRelation(r);
            })
            .catch(() => {
                if (!cancelled) setProfileRelation(null);
            });
        return () => {
            cancelled = true;
        };
    }, [authUser?.id, user?.id, isMe]);

    if (profileLoading) {
        return (
            <div className="p-6 text-center opacity-60">
                {t("profile.loadingProfile")}
            </div>
        );
    }

    if (!user || !authUser) {
        return (
            <div className="p-6 text-center opacity-60">
                {t("profile.notFound")}
            </div>
        );
    }

    const relation: FriendRelation =
        profileRelation ?? getRelation(user.id);

    const handleMessage = async () => {
        await openOrCreatePrivateChat(user.id);
        navigate("/messages");
    };

    const postAuthor: PostAuthor = {
        type: "user",
        userId: authUser.id,
    };

    return (
        <div className="h-[calc(100vh-80px)] overflow-y-auto p-4 fade-in">
            <div className="max-w-6xl mx-auto">

                <div className="flex gap-6 items-center">

                    <AvatarUploader
                        value={user.avatarUrl}
                        size={110}
                        disabled={!isMe}
                        onChange={async url => {
                            if (isMe) {
                                await updateProfile({ avatarUrl: url ?? "" });
                            }
                        }}
                    />

                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-bold neon-text">
                            {getUserDisplayName(user)}
                        </h1>

                        <div className="opacity-70">@{user.username}</div>

                        <div className="text-sm opacity-80 flex flex-col gap-1">
                            {user.city && (
                                <div className="flex gap-2 items-center">
                                    <Icon name="map-marker-alt" />
                                    {t("profile.livesIn")} <b>{user.city}</b>
                                </div>
                            )}

                            {user.education && (
                                <div className="flex gap-2 items-center">
                                    <Icon name="university" />
                                    {t("profile.studiesAt")} <b>{user.education}</b>
                                </div>
                            )}

                            <button
                                onClick={() => setShowDetails(v => !v)}
                                className="text-[var(--primary)] hover:underline flex gap-1 items-center"
                            >
                                <Icon name="info-circle" />
                                {showDetails
                                    ? t("profile.hideDetails")
                                    : t("profile.moreDetails")}
                            </button>
                        </div>

                        <div className="flex gap-6 mt-2">
                            <div>
                                <b>{posts.length}</b> {t("profile.posts")}
                            </div>
                            <div>
                                <b>
                                    {friendsCount === null
                                        ? "…"
                                        : String(friendsCount)}
                                </b>{" "}
                                {t("profile.friends")}
                            </div>
                        </div>
                    </div>
                </div>

                {showDetails && (
                    <ProfileDetails user={user} friendsCountValue={friendsCount} />
                )}

                <div className="mt-6 flex gap-4 flex-wrap">

                    {isMe && (
                        <>
                            <Button onClick={() => openEditProfile(user)}>
                                {t("profile.editProfile")}
                            </Button>

                            <Button
                                className="neon-pulse"
                                onClick={() => setShowPostEditor(v => !v)}
                            >
                                {t("profile.addPost")}
                            </Button>
                        </>
                    )}

                    {!isMe && (
                        <>
                            <Button
                                onClick={handleMessage}
                                className="neon-pulse"
                            >
                                <Icon name="envelope" />
                                {t("profile.message")}
                            </Button>

                            {relation === "friends" && (
                                <Button
                                    className="bg-red-600"
                                    onClick={async () => {
                                        await remove(authUser.id, user.id);
                                        await refreshRelation();
                                    }}
                                >
                                    {t("friends.removeFriend")}
                                </Button>
                            )}

                            {relation === "incoming" && (
                                <>
                                    <Button
                                        onClick={async () => {
                                            await accept(
                                                authUser.id,
                                                user.id,
                                            );
                                            await refreshRelation();
                                            await refreshFriendsCount();
                                        }}
                                    >
                                        {t("friends.acceptRequest")}
                                    </Button>
                                    <Button
                                        onClick={async () => {
                                            await decline(
                                                authUser.id,
                                                user.id,
                                            );
                                            await refreshRelation();
                                        }}
                                    >
                                        {t("friends.decline")}
                                    </Button>
                                </>
                            )}

                            {relation === "outgoing" && (
                                <Button
                                    onClick={async () => {
                                        await cancel(
                                            authUser.id,
                                            user.id,
                                        );
                                        await refreshRelation();
                                    }}
                                >
                                    {t("friends.cancelRequest")}
                                </Button>
                            )}

                            {relation === "none" && (
                                <Button
                                    onClick={async () => {
                                        await sendRequest(
                                            authUser.id,
                                            user.id,
                                        );
                                        await refreshRelation();
                                    }}
                                >
                                    {t("friends.addFriend")}
                                </Button>
                            )}
                        </>
                    )}
                </div>

                {isMe && showPostEditor && (
                    <Card className="mt-6 fade-in">
                        <PostEditor
                            author={postAuthor}
                            onSubmit={() => {
                                setShowPostEditor(false);
                                if (user?.id) void reloadProfilePosts(user.id);
                            }}
                        />
                    </Card>
                )}

                <Card className="mt-6">
                    <h2 className="text-xl font-semibold mb-2">
                        {t("profile.about")}
                    </h2>

                    {user.bio ? (
                        <p>{user.bio}</p>
                    ) : (
                        <p className="opacity-50 italic">
                            {t("profile.noDescription")}
                        </p>
                    )}
                </Card>

                <div className="flex flex-col gap-4 mt-6">

                    {postsLoading && (
                        <div className="opacity-60 text-center">
                            {t("profile.loadingPosts")}
                        </div>
                    )}

                    {!postsLoading && posts.length === 0 && (
                        <div className="opacity-60 text-center">
                            {t("profile.noPosts")}
                        </div>
                    )}

                    {posts.map(post => (
                        <Post
                            key={post.id}
                            post={post}
                            author={{
                                type: "user",
                                user,
                            }}
                            onDeleted={() =>
                                setProfilePosts(prev =>
                                    prev.filter(p => p.id !== post.id),
                                )
                            }
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}