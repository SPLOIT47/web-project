import { useState } from "react";
import { useTranslation } from "react-i18next";

import Card from "@components/ui/Card";
import Input from "@components/ui/Input";
import Button from "@components/ui/Button";
import Avatar from "@components/ui/Avatar";

import { useAuthStore } from "@/store/authStore";
import { usePostStore } from "@/store/postStore";
import { PostAuthor } from "@/domain/post/PostAuthor";

export default function CreatePost() {
    const { t } = useTranslation();
    const [content, setContent] = useState("");

    const me = useAuthStore(s => s.user);
    const createPost = usePostStore(s => s.createPost);

    if (!me) return null;

    const canPost = content.trim().length > 0;

    const author: PostAuthor = {
        type: "user",
        userId: me.id,
    };

    const handlePost = async () => {
        if (!canPost) return;

        await createPost(author, content.trim());
        setContent("");
    };

    return (
        <Card
            className="
                flex gap-3 mobile:gap-4
                items-start
                p-3 mobile:p-4
            "
        >
            <div className="shrink-0 hidden mobile:block">
                <Avatar src={me.avatarUrl} size={48} />
            </div>

            <div className="flex-1 flex flex-col gap-2 mobile:gap-3 min-w-0">
                <Input
                    placeholder={t("post.placeholder")}
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    className="text-sm mobile:text-base"
                />

                <div className="flex justify-end">
                    <Button
                        disabled={!canPost}
                        onClick={handlePost}
                        className="text-sm mobile:text-base px-4 mobile:px-6"
                    >
                        {t("post.button")}
                    </Button>
                </div>
            </div>
        </Card>
    );
}