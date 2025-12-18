import { useState } from "react";
import { useTranslation } from "react-i18next";

import Card from "@components/ui/Card";
import Avatar from "@components/ui/Avatar";
import Icon from "@components/ui/Icon";

import type { Post as PostEntity } from "@/domain/post/Post";
import type { PostWithAuthor } from "@/presentation/post/PostWithAuthor";

import { getUserDisplayName } from "@/presentation/user/userDisplayName";
import { usePostStore } from "@/store/postStore";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";

type Props = {
    post: PostEntity;
    author: PostWithAuthor["author"];
};

export default function Post({ post, author }: Props) {
    const { t } = useTranslation();
    const me = useAuthStore(s => s.user);
    const toggleLike = usePostStore(s => s.toggleLike);
    const addComment = usePostStore(s => s.addComment);
    const getUserById = useUserStore(s => s.getById);

    const [comment, setComment] = useState("");
    const [showComments, setShowComments] = useState(false);

    const isLiked =
        me != null && post.likes.includes(me.id);

    const handleComment = async () => {
        if (!comment.trim()) return;

        await addComment(post.id, comment);
        setComment("");
        setShowComments(true);
    };

    const avatarUrl =
        author.type === "user"
            ? author.user.avatarUrl
            : author.community.avatarUrl;

    const title =
        author.type === "user"
            ? getUserDisplayName(author.user)
            : author.community.name;

    const subtitle =
        author.type === "community" && author.senderUser
            ? `${t("post.publishedBy")} ${getUserDisplayName(
                author.senderUser
            )}`
            : undefined;

    return (
        <Card className="flex flex-col gap-3 p-4 fade-in">

            <div className="flex gap-4 items-center">
                <Avatar src={avatarUrl} size={46} />

                <div className="min-w-0">
                    <div className="font-bold neon-text-hover text-lg truncate">
                        {title}
                    </div>

                    {subtitle && (
                        <div className="text-xs opacity-70 truncate">
                            {subtitle}
                        </div>
                    )}

                    <div className="text-xs opacity-60">
                        {new Date(post.createdAt).toLocaleString()}
                    </div>
                </div>
            </div>

            <p>{post.content}</p>

            {post.images && post.images.length > 0 && (
                <img
                    src={post.images[0]}
                    alt="post"
                    className="rounded-lg border border-[var(--border-color)]"
                />
            )}

            <div className="flex gap-6 pt-2 text-lg items-center">

                <button
                    onClick={() => toggleLike(post.id)}
                    className={`
                        neon-text-hover flex items-center gap-1
                        ${isLiked ? "text-red-500" : ""}
                    `}
                >
                    <Icon name="heart" />
                    <span className="text-sm">
                        {post.likes.length}
                    </span>
                </button>

                <button
                    onClick={() => setShowComments(v => !v)}
                    className="flex items-center gap-1 opacity-70 neon-text-hover"
                >
                    <Icon name="comment" />
                    <span className="text-sm">
                        {post.comments.length}
                    </span>
                </button>
            </div>

            {showComments && post.comments.length > 0 && (
                <div className="flex flex-col gap-3 pt-3 border-t">

                    {post.comments.map(c => {
                        const user = getUserById(c.authorId);

                        return (
                            <div
                                key={c.id}
                                className="flex gap-3 items-start text-sm"
                            >
                                <Avatar
                                    src={user?.avatarUrl}
                                    size={32}
                                />

                                <div className="flex-1 min-w-0">
                                    <div className="font-medium truncate">
                                        {user
                                            ? getUserDisplayName(user)
                                            : c.authorId}
                                    </div>

                                    <div className="opacity-80">
                                        {c.text}
                                    </div>

                                    <div className="text-xs opacity-50">
                                        {new Date(
                                            c.createdAt
                                        ).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {me && (
                <div className="flex gap-2 pt-3">
                    <input
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        placeholder={t("post.commentPlaceholder")}
                        className="
                            flex-1 bg-transparent border-b
                            outline-none text-sm
                        "
                    />

                    <button
                        onClick={handleComment}
                        disabled={!comment.trim()}
                        className={`
                            px-3 py-1 rounded-md border text-sm
                            transition
                            ${
                            comment.trim()
                                ? "border-[var(--accent)] neon-text-hover"
                                : "opacity-40 cursor-not-allowed"
                        }
                        `}
                    >
                        {t("post.send")}
                    </button>
                </div>
            )}
        </Card>
    );
}