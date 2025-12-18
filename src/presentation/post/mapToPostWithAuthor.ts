import {Community} from "@/domain/community/Community";
import {PostWithAuthor} from "@/presentation/post/PostWithAuthor";
import {User} from "@/domain/user/User";
import {Post} from "@/domain/post/Post";

export function mapPostWithAuthor(
    post: Post,
    users: User[],
    communities: Community[]
): PostWithAuthor {

    switch (post.author.type) {

        case "user": {
            const author = post.author;

            const user = users.find(u => u.id === author.userId);
            if (!user) {
                throw new Error(`User not found: ${author.userId}`);
            }

            return {
                post,
                author: {
                    type: "user",
                    user,
                },
            };
        }

        case "community": {
            const author = post.author;

            const community = communities.find(
                c => c.id === author.communityId
            );

            if (!community) {
                throw new Error(`Community not found: ${author.communityId}`);
            }

            return {
                post,
                author: {
                    type: "community",
                    community,
                },
            };
        }

        default: {
            const _never: never = post.author;
            throw new Error("Unknown post author");
        }
    }
}