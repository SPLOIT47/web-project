import type { User } from "@/domain/user/User";
import type { Community } from "@/domain/community/Community";
import type { Post } from "@/domain/post/Post";

export type PostWithAuthor =
    | {
    post: Post;
    author: {
        type: "user";
        user: User;
    };
}
    | {
    post: Post;
    author: {
        type: "community";
        community: Community;
        senderUser?: User;
    };
};