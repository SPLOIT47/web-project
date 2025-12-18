import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

import Card from "@components/ui/Card";
import Input from "@components/ui/Input";
import Button from "@components/ui/Button";
import AvatarUploader from "@components/ui/AvatarUploader";

import {ServiceLocator} from "@/application/ServiceLocator";
import type {CreateCommunityPayload} from "@/domain/community/CreateCommunityPayload";
import {useAuthStore} from "@/store";
import {CommunityTypeId} from "@/domain/community/CommunityTypeId";

export default function CreateCommunityPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const authUser = useAuthStore(s => s.user);

    const [form, setForm] = useState<CreateCommunityPayload>({
        name: "",
        type: CommunityTypeId.Public,
        category: "Technology",
        description: "",
        avatarUrl: "",
        coverUrl: "",
    });

    const update = <K extends keyof CreateCommunityPayload>(
        key: K,
        value: CreateCommunityPayload[K]
    ) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const handleCreate = async () => {
        if (!authUser) return;

        const community = await ServiceLocator.communityService.create(
            form, authUser.id
        );

        navigate(`/communities/${community.id}`);
    };

    return (
        <div className="
            h-[calc(100vh-56px)] tablet:h-[calc(100vh-64px)] laptop:h-[calc(100vh-80px)] 
            overflow-y-auto 
            p-3 mobile:p-4 tablet:p-6 
            fade-in
        ">
            <div className="
                max-w-full mobile:max-w-full tablet:max-w-2xl laptop:max-w-3xl 
                mx-auto
            ">

                <h1 className="
                    text-2xl mobile:text-3xl 
                    font-bold neon-text 
                    mb-4 tablet:mb-6
                ">
                    {t("createCommunity.title")}
                </h1>

                <Card className="flex flex-col gap-5">

                    <Input
                        placeholder={t("createCommunity.name")}
                        value={form.name}
                        onChange={e => update("name", e.target.value)}
                    />

                    <div className="flex flex-col">
                        <label className="opacity-80 mb-1">{t("createCommunity.category")}</label>
                        <select
                            value={form.category}
                            onChange={e => update("category", e.target.value)}
                            className="p-3 rounded bg-[var(--bg-surface)] border"
                        >
                            <option>{t("createCommunity.categoryTechnology")}</option>
                            <option>{t("createCommunity.categoryDesign")}</option>
                            <option>{t("createCommunity.categoryEducation")}</option>
                            <option>{t("createCommunity.categoryScience")}</option>
                            <option>{t("createCommunity.categoryEntertainment")}</option>
                            <option>{t("createCommunity.categorySports")}</option>
                        </select>
                    </div>

                    <div>
                        <label className="opacity-80 mb-1 block">
                            {t("createCommunity.description")}
                        </label>
                        <textarea
                            value={form.description}
                            onChange={e =>
                                update("description", e.target.value)
                            }
                            placeholder={t("createCommunity.descriptionPlaceholder")}
                            className="w-full p-3 h-32 rounded bg-[var(--bg-surface)] border"
                        />
                    </div>

                    <div>
                        <label className="opacity-80 mb-2 block">{t("createCommunity.avatar")}</label>
                        <AvatarUploader
                            value={form.avatarUrl}
                            size={96}
                            onChange={url => update("avatarUrl", url ?? "")}
                        />
                    </div>

                    <div>
                        <label className="opacity-80 mb-2 block">{t("createCommunity.cover")}</label>
                        <AvatarUploader
                            value={form.coverUrl}
                            size={160}
                            onChange={url => update("coverUrl", url ?? "")}
                        />
                    </div>

                    <Button
                        className="mt-4"
                        disabled={loading || !form.name.trim()}
                        onClick={handleCreate}
                    >
                        {loading ? t("createCommunity.creating") : t("createCommunity.create")}
                    </Button>

                </Card>
            </div>
        </div>
    );
}