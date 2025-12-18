import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import BaseModal from "@components/ui/modal/BaseModal";
import Card from "@components/ui/Card";
import Button from "@components/ui/Button";
import Icon from "@components/ui/Icon";

import { useCommunityPageStore } from "@/store/communityPageStore";
import { useModalStore } from "@/store/modalStore";

export default function ConfirmDeleteCommunityModal({
                                                        open,
                                                        communityId,
                                                        onClose,
                                                    }: {
    open: boolean;
    communityId: string;
    onClose: () => void;
}) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const deleteCommunity = useCommunityPageStore(
        s => s.deleteCommunity
    );

    const handleDelete = async () => {
        await deleteCommunity(communityId);
        onClose();
        navigate("/communities");
    };

    return (
        <BaseModal open={open} onClose={onClose} maxWidth="max-w-md">
            <Card className="p-6">

                <div className="flex items-center gap-3 mb-4">
                    <Icon
                        name="trash"
                        className="text-red-500 text-xl"
                    />
                    <h2 className="text-xl font-bold neon-text">
                        {t("modal.confirmDelete.title")}
                    </h2>
                </div>

                <p className="opacity-80 mb-6">
                    {t("modal.confirmDelete.message")}
                </p>

                <div className="flex gap-3 justify-end">
                    <Button
                        onClick={onClose}
                    >
                        {t("modal.confirmDelete.cancel")}
                    </Button>

                    <Button
                        className="bg-red-700 hover:bg-red-800"
                        onClick={handleDelete}
                    >
                        {t("modal.confirmDelete.delete")}
                    </Button>
                </div>
            </Card>
        </BaseModal>
    );
}