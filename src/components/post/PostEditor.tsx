import {useState} from "react";
import {useTranslation} from "react-i18next";

import Button from "@components/ui/Button";
import Input from "@components/ui/Input";

import {ServiceLocator} from "@/application/ServiceLocator";
import {usePostStore} from "@/store/postStore";
import FilePicker from "@components/ui/FilePicker";

type PostAuthor =
    | { type: "user"; userId: string }
    | { type: "community"; communityId: string; senderUserId: string };

type Props = {
    author: PostAuthor;
    onSubmit?: () => void;
    showFiles?: boolean;
};

export default function PostEditor({
                                       author,
                                       onSubmit,
                                       showFiles = true,
                                   }: Props) {
    const { t } = useTranslation();
    const [content, setContent] = useState("");
    const [files, setFiles] = useState<File[]>([]);

    const createPost = usePostStore(s => s.createPost);
    const loading = usePostStore(s => s.loading);

    const canPost = content.trim().length > 0;

    const handleSubmit = async () => {
        if (!canPost) return;

        const uploaded = showFiles
            ? await Promise.all(
                files.map(f => ServiceLocator.fileService.upload(f))
            )
            : [];

        const imageUrls = uploaded.map(f => f.url);

        await createPost(author, content.trim(), imageUrls);

        setContent("");
        setFiles([]);
        onSubmit?.();
    };

    return (
        <div className="flex flex-col gap-3">
            <Input
                placeholder={t("post.placeholder")}
                value={content}
                onChange={e => setContent(e.target.value)}
            />

            {showFiles && (
                <FilePicker
                    files={files}
                    onChange={setFiles}
                />
            )}

            <div className="flex justify-end">
                <Button
                    disabled={!canPost || loading}
                    onClick={handleSubmit}
                    className="px-6"
                >
                    {t("post.button")}
                </Button>
            </div>
        </div>
    );
}