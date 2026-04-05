import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import Card from "@components/ui/Card";
import Avatar from "@components/ui/Avatar";
import Icon from "@components/ui/Icon";

import type { Post as PostEntity } from "@/domain/post/Post";
import type { Comment as CommentEntity } from "@/domain/post/Comment";
import type { PostWithAuthor } from "@/presentation/post/PostWithAuthor";

import { ServiceLocator } from "@/application/ServiceLocator";
import type { User } from "@/domain/user/User";
import { getUserDisplayName } from "@/presentation/user/userDisplayName";
import { usePostStore } from "@/store/postStore";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";
import { HttpError } from "@/infrastructure/http/httpClient";
import { isUuidString } from "@/utils/uuid";
import { getApiBase } from "@/infrastructure/http/apiConfig";

type Props = {
    post: PostEntity;
    author: PostWithAuthor["author"];
    /** После удаления (напр. список на профиле / в сообществе) */
    onDeleted?: () => void;
};

export default function Post({ post, author, onDeleted }: Props) {
    const { t } = useTranslation();
    const me = useAuthStore(s => s.user);
    const toggleLike = usePostStore(s => s.toggleLike);
    const addComment = usePostStore(s => s.addComment);
    const deletePost = usePostStore(s => s.deletePost);
    /** Подписка на массив — иначе после upsertMany профилей комментаторов ре-рендера не будет (getById стабилен). */
    const users = useUserStore(s => s.users);
    const upsertUsers = useUserStore(s => s.upsertMany);

    const [comment, setComment] = useState("");
    const [showComments, setShowComments] = useState(false);

    /** Локально: иначе комментарии не видны на профиле / в сообществе (нет в allPosts) */
    const [comments, setComments] = useState<CommentEntity[]>(post.comments);
    /** Локально: лента и профиль хранят посты по-разному; стор обновляет только allPosts */
    const [likeIds, setLikeIds] = useState(post.likes);
    const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);

    /**
     * Сбрасываем при смене поста. Длины массивов — чтобы подтянуть refetch с сервера,
     * но не сами массивы (новый [] каждый рендер затирал бы оптимистичные правки).
     */
    useEffect(() => {
        setComments(post.comments);
        setLikeIds(post.likes);
    }, [post.id, post.comments.length, post.likes.length]);

    useEffect(() => {
        const first = post.images?.[0];
        console.info("[PostImage] resolve start", {
            postId: post.id,
            firstMedia: first,
            imagesCount: post.images?.length ?? 0,
        });
        if (!first) {
            setImageSrc(undefined);
            console.info("[PostImage] no image ref", { postId: post.id });
            return;
        }

        let cancelled = false;
        const resolve = async () => {
            // Новый формат: в payload.media лежит mediaId -> получаем актуальный URL.
            if (isUuidString(first)) {
                const base = getApiBase();
                const mediaUrl = `${base}/api/media/${encodeURIComponent(first)}/download`;
                if (!cancelled) {
                    setImageSrc(mediaUrl);
                    console.info("[PostImage] resolved mediaId -> download URL", {
                        postId: post.id,
                        mediaId: first,
                        mediaUrl,
                    });
                }
                return;
            }

            // Старый формат (url в посте) оставляем как fallback.
            if (!cancelled) {
                setImageSrc(first);
                console.info("[PostImage] using raw image URL", {
                    postId: post.id,
                    url: first,
                });
            }
        };

        void resolve();
        return () => {
            cancelled = true;
        };
    }, [post.id, post.images]);

    /** Авторы комментариев: batch мог не вернуть пользователя; догружаем по одному. */
    useEffect(() => {
        const missing = [...new Set(comments.map(c => c.authorId))].filter(
            id =>
                isUuidString(id) &&
                id !== me?.id &&
                !users.some(u => u.id === id),
        );
        if (missing.length === 0) return;
        let cancelled = false;
        void (async () => {
            const results = await Promise.all(
                missing.map(id => ServiceLocator.userService.getById(id)),
            );
            if (cancelled) return;
            const ok = results.filter((u): u is User => u != null);
            if (ok.length > 0) {
                upsertUsers(ok);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [comments, users, me?.id, upsertUsers]);

    const isLiked = me != null && likeIds.includes(me.id);

    const canDelete =
        me != null &&
        (post.author.type === "user"
            ? post.author.userId === me.id
            : author.type === "community" &&
              (author.community.admins.includes(me.id) ||
                  (author.community.moderators?.includes(me.id) ??
                      false)));

    const handleDelete = async () => {
        if (!canDelete) return;
        if (!window.confirm(t("post.confirmDelete"))) return;
        try {
            await deletePost(post.id);
            onDeleted?.();
        } catch (e) {
            const msg =
                e instanceof HttpError ? e.message : t("post.deleteFailed");
            window.alert(msg);
        }
    };

    const handleLike = async () => {
        if (!me) return;
        const wasLiked = isLiked;
        const next = wasLiked
            ? likeIds.filter(id => id !== me.id)
            : [...likeIds, me.id];
        setLikeIds(next);
        try {
            await toggleLike(post.id, wasLiked);
        } catch {
            setLikeIds(post.likes);
        }
    };

    const handleComment = async () => {
        if (!comment.trim() || !me) return;

        const text = comment.trim();
        setComment("");
        try {
            const saved = await addComment(post.id, text);
            setComments(prev =>
                prev.some(c => c.id === saved.id) ? prev : [...prev, saved],
            );
            setShowComments(true);
        } catch (e) {
            setComment(text);
            const msg =
                e instanceof HttpError ? e.message : t("post.commentFailed");
            window.alert(msg);
        }
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

            {imageSrc && (
                <img
                    src={imageSrc}
                    alt="post"
                    className="rounded-lg border border-[var(--border-color)]"
                    onLoad={() =>
                        console.info("[PostImage] img loaded", {
                            postId: post.id,
                            src: imageSrc,
                        })
                    }
                    onError={e =>
                        console.error("[PostImage] img error", {
                            postId: post.id,
                            src: imageSrc,
                            currentSrc: (e.currentTarget as HTMLImageElement).currentSrc,
                        })
                    }
                />
            )}

            <div className="flex gap-6 pt-2 text-lg items-center flex-wrap">

                <button
                    type="button"
                    onClick={() => void handleLike()}
                    className={`
                        neon-text-hover flex items-center gap-1
                        ${isLiked ? "text-red-500" : ""}
                    `}
                >
                    {/* pointer-events-none: клик попадает на button, не на SVG — иначе у SVG className — SVGAnimatedString и ломают некоторые расширения браузера */}
                    <Icon name="heart" className="pointer-events-none" />
                    <span className="text-sm">
                        {likeIds.length}
                    </span>
                </button>

                <button
                    type="button"
                    onClick={() => setShowComments(v => !v)}
                    className="flex items-center gap-1 opacity-70 neon-text-hover"
                >
                    <Icon name="comment" className="pointer-events-none" />
                    <span className="text-sm">
                        {comments.length}
                    </span>
                </button>

                {canDelete && (
                    <button
                        type="button"
                        onClick={() => void handleDelete()}
                        title={t("post.deletePost")}
                        className="flex items-center gap-1 text-red-400/90 hover:text-red-300 ml-auto"
                    >
                        <Icon name="trash" className="pointer-events-none" />
                        <span className="text-sm">{t("post.deletePost")}</span>
                    </button>
                )}
            </div>

            {showComments && comments.length > 0 && (
                <div className="flex flex-col gap-3 pt-3 border-t">

                    {comments.map(c => {
                        const user =
                            users.find(u => u.id === c.authorId) ??
                            (c.authorId === me?.id ? me : undefined);
                        const displayName = user
                            ? (() => {
                                  const full = getUserDisplayName(user).trim();
                                  return full || `@${user.username}`;
                              })()
                            : c.authorId;

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
                                        {displayName}
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
                        type="button"
                        onClick={() => void handleComment()}
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