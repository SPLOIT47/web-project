import { useState } from "react";
import Card from "@components/ui/Card";
import Button from "@components/ui/Button";
import type { User } from "@/domain/user/User";

export default function EditProfileModal({
                                             user,
                                             onClose,
                                         }: {
    user: User;
    onClose: () => void;
}) {
    const [name, setName] = useState(user.name);
    const [bio, setBio] = useState(user.bio ?? "");

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 fade-in">
            <Card className="p-6 w-[400px]">

                <h2 className="text-xl font-semibold neon-text mb-4">Edit Profile</h2>

                <input
                    className="w-full mb-3 p-2 border rounded bg-[var(--bg-surface)]"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <textarea
                    className="w-full mb-3 p-2 border rounded bg-[var(--bg-surface)]"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                />

                <div className="flex justify-end gap-3">
                    <Button onClick={onClose}>Cancel</Button>
                    <Button className="neon-btn">Save</Button>
                </div>

            </Card>
        </div>
    );
}