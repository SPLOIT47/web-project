import Icon from "@components/ui/Icon";
import Card from "@components/ui/Card";
import type { User } from "@/domain/user/User";

export default function ProfileDetails({ user }: { user: User }) {
    return (
        <Card className="mt-4 p-4 fade-in">
            <h2 className="text-xl font-semibold neon-text mb-3">Profile Details</h2>

            <div className="flex flex-col gap-3 text-sm">

                {user.birthday && (
                    <Item icon="birthday-cake" label="Birth date" value={user.birthday} />
                )}

                {user.city && (
                    <Item icon="map-marker-alt" label="City" value={user.city} />
                )}

                {user.education && (
                    <Item icon="university" label="Education" value={user.education} />
                )}

                <Item icon="user-friends" label="Friends" value={String(user.friends.length ?? 0)} />
                <Item icon="star" label="Followers" value={String(user.followers.length ?? 0)} />
                <Item icon="user-check" label="Following" value={String(user.following?.length ?? 0)} />

                {user.languages && (
                    <Item icon="globe" label="Languages" value={user.languages.join(", ")} />
                )}

            </div>
        </Card>
    );
}

function Item({ icon, label, value }: { icon: string; label: string; value: string }) {
    return (
        <div className="flex gap-3 items-center">
            <Icon name={icon} className="text-[var(--primary)] text-lg" />
            <div className="opacity-80 w-32">{label}:</div>
            <div className="font-semibold neon-text flex-1">{value}</div>
        </div>
    );
}