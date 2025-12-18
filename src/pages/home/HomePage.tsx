import { useEffect } from "react";

import CreatePost from "@components/feed/CreatePost";
import Post from "@components/feed/Post";

import { usePostStore } from "@/store/postStore";
import { useUserStore } from "@/store/userStore";
import { useCommunityStore } from "@/store/communityStore";


export default function HomePage() {
    const posts = usePostStore(s => s.allPosts);
    const loadFeed = usePostStore(s => s.loadFeed);
    const loadCommunities = useCommunityStore(s => s.loadAll);

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

            {posts.map(post => {
                if (post.author.type === "user") {
                    const author = getUserById(post.author.userId);
                    if (!author) return null;

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
                    post.author.communityId
                );
                if (!community) return null;

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