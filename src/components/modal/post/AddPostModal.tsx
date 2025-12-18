import BaseModal from "@components/ui/modal/BaseModal";
import Card from "@components/ui/Card";
import PostEditor from "@components/post/PostEditor";

type Props = {
    open: boolean;
    onClose: () => void;
    author: {
        type: "user" | "community";
        id: string;
        senderUserId?: string;
    };
};

export default function AddPostModal({ open, onClose, author }: Props) {
    return (
        <BaseModal open={open} onClose={onClose} maxWidth="max-w-lg">
            <Card className="p-6 fade-in">
                <PostEditor
                    author={
                        author.type === "user"
                            ? { type: "user", userId: author.id }
                            : {
                                type: "community",
                                communityId: author.id,
                                senderUserId: author.senderUserId!,
                            }
                    }
                    onSubmit={onClose}
                />
            </Card>
        </BaseModal>
    );
}