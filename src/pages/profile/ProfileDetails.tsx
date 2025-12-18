import { useTranslation } from "react-i18next";
import Icon from "@components/ui/Icon";
import Card from "@components/ui/Card";
import type { User } from "@/domain/user/User";

export default function ProfileDetails({ user }: { user: User }) {
    const { t } = useTranslation();

    return (
        <Card className="mt-4 p-4 fade-in">
            <h2 className="text-xl font-semibold neon-text mb-3">{t("profile.profileDetails")}</h2>

            <div className="flex flex-col gap-3 text-sm">

                {user.birthday && (
                    <Item icon="birthday-cake" label={t("profile.birthDate")} value={user.birthday} />
                )}

                {user.city && (
                    <Item icon="map-marker-alt" label={t("profile.city")} value={user.city} />
                )}

                {user.education && (
                    <Item icon="university" label={t("profile.education")} value={user.education} />
                )}

                <Item icon="user-friends" label={t("profile.friends")} value={String(user.friends.length ?? 0)} />

                {user.languages && (
                    <Item icon="globe" label={t("profile.languages")} value={user.languages.join(", ")} />
                )}

            </div>
        </Card>
    );
}

function Item({ icon, label, value }: { icon: string; label: string; value: string }) {
    return (
        <div className="flex gap-3 items-center">
            <Icon name={icon as any} className="text-[var(--primary)] text-lg" />
            <div className="opacity-80 w-32">{label}:</div>
            <div className="font-semibold neon-text flex-1">{value}</div>
        </div>
    );
}