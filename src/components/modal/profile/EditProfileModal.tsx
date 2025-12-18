import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import BaseModal from "@components/ui/modal/BaseModal";
import Card from "@components/ui/Card";
import Button from "@components/ui/Button";
import Avatar from "@components/ui/Avatar";
import Icon from "@components/ui/Icon";

import { useProfileStore } from "@/store/profileStore";
import type { User } from "@/domain/user/User";
import type { EditProfilePayload } from "@/domain/user/EditProfilePayload";
import { ServiceLocator } from "@/application/ServiceLocator";

export default function EditProfileModal({
                                             open,
                                             user,
                                             onClose,
                                         }: {
    open: boolean;
    user: User;
    onClose: () => void;
}) {
    const { t } = useTranslation();
    const updateProfile = useProfileStore(s => s.updateProfile);
    const loading = useProfileStore(s => s.loading);

    const fileRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState<EditProfilePayload>({
        name: user.name ?? "",
        surname: user.surname ?? "",
        bio: user.bio ?? "",
        birthday: user.birthday ?? "",
        city: user.city ?? "",
        education: user.education ?? "",
        languages: user.languages ?? [],
        avatarUrl: user.avatarUrl ?? "",
    });

    const updateField = <K extends keyof EditProfilePayload>(
        key: K,
        value: EditProfilePayload[K]
    ) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const handleAvatarSelected = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const uploaded = await ServiceLocator.fileService.upload(file);
        updateField("avatarUrl", uploaded.url);

        e.target.value = "";
    };

    const handleSave = async () => {
        await updateProfile(form);
        onClose();
    };

    return (
        <BaseModal open={open} onClose={onClose} maxWidth="max-w-md">
            <Card className="p-6 fade-in">
                <h2 className="text-xl font-semibold neon-text mb-4">
                    {t("modal.editProfile.title")}
                </h2>

                <div className="flex items-center gap-4 mb-4">
                    <Avatar src={form.avatarUrl} size={64} />

                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarSelected}
                    />

                    <div className="flex gap-2">
                        <Button
                            onClick={() => fileRef.current?.click()}
                            disabled={loading}
                            className="flex gap-2 items-center"
                        >
                            <Icon name="upload" />
                            {t("modal.editProfile.upload")}
                        </Button>

                        <Button
                            onClick={() => updateField("avatarUrl", "")}
                            disabled={loading}
                            className="flex gap-2 items-center"
                        >
                            <Icon name="trash" />
                            {t("modal.editProfile.remove")}
                        </Button>
                    </div>
                </div>

                <input
                    className="w-full mb-3 p-2 border rounded bg-[var(--bg-surface)]"
                    placeholder={t("modal.editProfile.name")}
                    value={form.name}
                    onChange={e => updateField("name", e.target.value)}
                />

                <input
                    className="w-full mb-3 p-2 border rounded bg-[var(--bg-surface)]"
                    placeholder={t("modal.editProfile.surname")}
                    value={form.surname}
                    onChange={e => updateField("surname", e.target.value)}
                />

                <textarea
                    className="w-full mb-3 p-2 border rounded bg-[var(--bg-surface)]"
                    placeholder={t("modal.editProfile.bio")}
                    rows={3}
                    value={form.bio}
                    onChange={e => updateField("bio", e.target.value)}
                />

                <input
                    type="date"
                    className="w-full mb-3 p-2 border rounded bg-[var(--bg-surface)]"
                    value={form.birthday}
                    onChange={e => updateField("birthday", e.target.value)}
                />

                <input
                    className="w-full mb-3 p-2 border rounded bg-[var(--bg-surface)]"
                    placeholder={t("modal.editProfile.city")}
                    value={form.city}
                    onChange={e => updateField("city", e.target.value)}
                />

                <input
                    className="w-full mb-4 p-2 border rounded bg-[var(--bg-surface)]"
                    placeholder={t("modal.editProfile.education")}
                    value={form.education}
                    onChange={e => updateField("education", e.target.value)}
                />

                <div className="flex justify-end gap-3">
                    <Button onClick={onClose} disabled={loading}>
                        {t("common.cancel")}
                    </Button>
                    <Button onClick={handleSave} disabled={loading}>
                        {loading ? t("modal.editProfile.saving") : t("common.save")}
                    </Button>
                </div>
            </Card>
        </BaseModal>
    );
}