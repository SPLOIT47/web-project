import { useEffect } from "react";

import CreatePost from "@components/feed/CreatePost";
import Post from "@components/feed/Post";
import Card from "@components/ui/Card";

import { useAuthStore } from "@/store/authStore";
import { usePostStore } from "@/store/postStore";
import { useUserStore } from "@/store/userStore";
import { useCommunityStore } from "@/store/communityStore";

export default function HomePage() {
    const posts = usePostStore(s => s.allPosts);
    const feedLoading = usePostStore(s => s.loading);
    const loadFeed = usePostStore(s => s.loadFeed);
    const loadCommunities = useCommunityStore(s => s.loadAll);

    const me = useAuthStore(s => s.user);
    const getUserById = useUserStore(s => s.getById);
    const getCommunityById = useCommunityStore(s => s.getById);

    useEffect(() => {
        loadFeed();
        loadCommunities();
    }, [loadFeed, loadCommunities]);

    return (
        <main
            className="
                w-full
                max-w-full mobile:max-w-full tablet:max-w-2xl laptop:max-w-3xl desktop:max-w-4xl
                h-full overflow-y-auto
                flex flex-col gap-3 tablet:gap-4
                pb-6 tablet:pb-10
                pr-1 tablet:pr-2
            "
        >
            <CreatePost />

            {!feedLoading && posts.length === 0 && (
                <p className="opacity-60 text-center text-sm py-6">
                    В ленте пока нет постов.
                </p>
            )}

            {posts.map(post => {
                if (post.author.type === "user") {
                    const author =
                        getUserById(post.author.userId) ??
                        (me?.id === post.author.userId ? me : undefined);
                    if (!author) {
                        return (
                            <Card
                                key={post.id}
                                className="opacity-70 p-4 text-sm"
                            >
                                Загрузка профиля автора…
                            </Card>
                        );
                    }

                    return (
                        <Post
                            key={post.id}
                            post={post}
                            author={{
                                type: "user",
                                user: author,
                            }}
                        />
                    );
                }

                const community = getCommunityById(
                    post.author.communityId,
                );
                if (!community) {
                    return (
                        <Card
                            key={post.id}
                            className="opacity-70 p-4 text-sm"
                        >
                            Загрузка сообщества…
                        </Card>
                    );
                }

                const senderUser = post.author.senderUserId
                    ? getUserById(post.author.senderUserId)
                    : undefined;

                return (
                    <Post
                        key={post.id}
                        post={post}
                        author={{
                            type: "community",
                            community,
                            senderUser,
                        }}
                    />
                );
            })}
        </main>
    );
}