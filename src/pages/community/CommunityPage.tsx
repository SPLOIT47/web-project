import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAuthStore, useChatStore } from "@/store";
import { useCommunityPageStore } from "@/store/communityPageStore";
import { useModalStore } from "@/store/modalStore";

import CommunityHeader from "@components/community/CommunityHeader";
import PostEditor from "@components/post/PostEditor";

import Card from "@components/ui/Card";
import Button from "@components/ui/Button";
import Post from "@components/feed/Post";

import { COMMUNITY_TYPES } from "@/domain/community/CommunityTypes";

export default function CommunityPage() {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const authUser = useAuthStore(s => s.user);
    const openConfirmDelete = useModalStore(
        s => s.openConfirmDeleteCommunity
    );
    const openCommunityDetails = useModalStore(
        s => s.openCommunityDetails
    );
    const openCommunityChat = useChatStore(s => s.openCommunityChat);

    const {
        community,
        posts,
        loading,
        load,
        follow,
        unfollow,
    } = useCommunityPageStore();

    useEffect(() => {
        if (id) load(id);
    }, [id, load]);

    if (loading || !community) {
        return (
            <div className="p-6 text-center opacity-60">
                {t("communityPage.loadingCommunity")}
            </div>
        );
    }

    const userId = authUser?.id;

    const isAdmin =
        !!userId && community.admins.includes(userId);

    const isModerator =
        !!userId && community.moderators?.includes(userId);

    const canWritePosts = isAdmin || isModerator;

    const isFollower =
        !!userId && community.followers.includes(userId);

    const typeConfig = COMMUNITY_TYPES[community.type];

    return (
        <div
            className="
                h-[calc(100vh-56px)]
                tablet:h-[calc(100vh-64px)]
                laptop:h-[calc(100vh-80px)]
                overflow-y-auto
                text-[var(--text-main)]
                fade-in
            "
        >
            <CommunityHeader community={community} />

            <div
                className="
                    max-w-full
                    tablet:max-w-4xl
                    laptop:max-w-6xl
                    desktop:max-w-7xl
                    mx-auto
                    p-3 tablet:p-6
                    flex flex-col laptop:flex-row
                    gap-6
                "
            >
                <main className="flex-1 min-w-0">

                    <Card className="mb-6">
                        <h2 className="text-xl font-semibold neon-text mb-2">
                            {t("communityPage.aboutCommunity")}
                        </h2>

                        {community.description ? (
                            <p className="opacity-80 whitespace-pre-line">
                                {community.description}
                            </p>
                        ) : (
                            <p className="opacity-50 italic">
                                {t("communityPage.noDescription")}
                            </p>
                        )}
                    </Card>

                    <div className="flex flex-wrap gap-4 mb-8">

                        {authUser && !isFollower && !isAdmin && (
                            <Button
                                onClick={() =>
                                    follow(community.id, authUser.id)
                                }
                            >
                                {typeConfig.joinPolicy === "request"
                                    ? t("communityPage.requestToJoin")
                                    : t("communityPage.joinCommunity")}
                            </Button>
                        )}

                        {authUser && isFollower && !canWritePosts && (
                            <Button
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() =>
                                    unfollow(community.id, authUser.id)
                                }
                            >
                                {t("communityPage.leaveCommunity")}
                            </Button>
                        )}

                        {authUser && canWritePosts && (
                            <>
                                {isAdmin && (
                                    <>
                                        <Button
                                            onClick={() =>
                                                navigate(
                                                    `/communities/${community.id}/settings`
                                                )
                                            }
                                        >
                                            {t("communityPage.editCommunity")}
                                        </Button>

                                        <Button
                                            className="bg-red-700 hover:bg-red-800"
                                            onClick={() =>
                                                openConfirmDelete(community.id)
                                            }
                                        >
                                            {t("communityPage.deleteCommunity")}
                                        </Button>
                                    </>
                                )}
                            </>
                        )}
                    </div>

                    {authUser && canWritePosts && (
                        <Card className="mb-6 p-4">
                            <PostEditor
                                author={{
                                    type: "community",
                                    communityId: community.id,
                                    senderUserId: authUser.id,
                                }}
                            />
                        </Card>
                    )}

                    <div className="flex flex-col gap-4">
                        {posts.length === 0 && (
                            <div className="opacity-60 text-center">
                                {t("communityPage.noPosts")}
                            </div>
                        )}

                        {posts.map(({ post, author }) => (
                            <Post
                                key={post.id}
                                post={post}
                                author={author}
                            />
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}