import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Card from "@components/ui/Card";
import Button from "@components/ui/Button";
import Icon from "@components/ui/Icon";
import BaseModal from "@components/ui/modal/BaseModal";

import { ServiceLocator } from "@/application/ServiceLocator";
import type { CommunityDetails } from "@/domain/community/details/CommunityDetails";

export default function CommunityDetailsModal({
                                                  open,
                                                  communityId,
                                                  onClose,
                                              }: {
    open: boolean;
    communityId: string;
    onClose: () => void;
}) {
    const { t } = useTranslation();
    const [details, setDetails] = useState<CommunityDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!open) return;

        setLoading(true);
        ServiceLocator.communityDetailsService
            .getByCommunityId(communityId)
            .then(setDetails)
            .finally(() => setLoading(false));
    }, [open, communityId]);

    return (
        <BaseModal open={open} onClose={onClose} maxWidth="max-w-2xl">
            <Card className="p-6 fade-in">

                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold neon-text">
                        {t("modal.communityDetails.title")}
                    </h2>
                    <button onClick={onClose}>
                        <Icon name="times" />
                    </button>
                </div>

                {loading && (
                    <div className="opacity-60 text-center">
                        {t("common.loading")}
                    </div>
                )}

                {!loading && !details && (
                    <div className="opacity-60 text-center">
                        {t("communityPage.noDescription")}
                    </div>
                )}

                {!loading && details && (
                    <>
                        {details.shortDescription && (
                            <p className="opacity-80 mb-4">
                                {details.shortDescription}
                            </p>
                        )}

                        {details.fullDescription && (
                            <p className="whitespace-pre-line mb-4">
                                {details.fullDescription}
                            </p>
                        )}
                    </>
                )}

                <Button className="mt-6 w-full" onClick={onClose}>
                    {t("common.close")}
                </Button>
            </Card>
        </BaseModal>
    );
}