import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Card from "@components/ui/Card";
import Icon from "@components/ui/Icon";
import { ServiceLocator } from "@/application/ServiceLocator";
import type { CommunityDetails } from "@/domain/community/details/CommunityDetails";

export default function ContactsCard({
                                         communityId,
                                     }: {
    communityId: string;
}) {
    const { t } = useTranslation();
    const [details, setDetails] = useState<CommunityDetails | null>(null);

    useEffect(() => {
        ServiceLocator.communityDetailsService
            .getByCommunityId(communityId)
            .then(setDetails);
    }, [communityId]);

    if (!details?.contacts) return null;

    const { contacts } = details;

    return (
        <Card>
            <h3 className="font-semibold neon-text mb-3">
                {t("communityRightbar.contacts")}
            </h3>

            <div className="flex flex-col gap-2 text-sm opacity-80">

                {contacts.email && (
                    <div className="flex gap-2 items-center">
                        <Icon name="envelope" />
                        <span>{contacts.email}</span>
                    </div>
                )}

                {contacts.phone && (
                    <div className="flex gap-2 items-center">
                        <Icon name="phone" />
                        <span>{contacts.phone}</span>
                    </div>
                )}

                {contacts.telegram && (
                    <div className="flex gap-2 items-center">
                        <Icon name="paper-plane" />
                        <span>{contacts.telegram}</span>
                    </div>
                )}

                {contacts.website && (
                    <div className="flex gap-2 items-center">
                        <Icon name="globe" />
                        <span>{contacts.website}</span>
                    </div>
                )}
            </div>
        </Card>
    );
}