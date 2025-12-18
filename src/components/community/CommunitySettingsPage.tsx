import { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";
import { useTranslation } from "react-i18next";

import Card from "@components/ui/Card";
import Button from "@components/ui/Button";
import Input from "@components/ui/Input";

import { useCommunityDetailsStore } from "@/store/communityDetailsStore";
import type { CommunityDetails } from "@/domain/community/details/CommunityDetails";

export default function CommunityDetailsSettingsPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { details, load, update, loading } = useCommunityDetailsStore();

    const [form, setForm] = useState<CommunityDetails | null>(null);

    useEffect(() => {
        if (id) load(id);
    }, [id, load]);

    useEffect(() => {
        if (details) {
            setForm(details);
        }
    }, [details]);

    if (loading || !form) {
        return <div className="p-6 opacity-60">{t("common.loading")}</div>;
    }

    const updateField = <K extends keyof CommunityDetails>(
        key: K,
        value: CommunityDetails[K]
    ) => {
        setForm(prev => prev ? { ...prev, [key]: value } : prev);
    };

    return (
        <Card className="max-w-3xl mx-auto p-6 flex flex-col gap-6 fade-in">

            <h1 className="text-2xl font-bold neon-text">
                {t("communitySettings.details.title")}
            </h1>

            <Input
                value={form.shortDescription ?? ""}
                onChange={e =>
                    updateField("shortDescription", e.target.value)
                }
                placeholder={t("communitySettings.details.shortDescription")}
            />

            <div>
                <label className="opacity-80 mb-1 block">
                    {t("communitySettings.details.fullDescription")}
                </label>
                <textarea
                    value={form.fullDescription ?? ""}
                    onChange={e =>
                        updateField("fullDescription", e.target.value)
                    }
                    className="
                        w-full h-48 p-3 rounded
                        bg-[var(--bg-surface)]
                        border border-[var(--border-color)]
                    "
                />
            </div>

            <Input
                value={(form.tags ?? []).join(", ")}
                onChange={e =>
                    updateField(
                        "tags",
                        e.target.value
                            .split(",")
                            .map(t => t.trim())
                            .filter(Boolean)
                    )
                }
                placeholder={t("communitySettings.details.tags")}
            />

            <div className="flex gap-4">
                <select
                    value={form.status?.type ?? "open"}
                    onChange={e =>
                        updateField("status", {
                            ...form.status,
                            type: e.target.value as "open" | "closed",
                        })
                    }
                    className="
                        p-3 rounded
                        bg-[var(--bg-surface)]
                        border border-[var(--border-color)]
                    "
                >
                    <option value="open">{t("communitySettings.details.open")}</option>
                    <option value="closed">{t("communitySettings.details.closed")}</option>
                </select>

                {form.status?.type === "closed" && (
                    <Input
                        type="time"
                        value={form.status?.opensAt ?? ""}
                        onChange={e =>
                            updateField("status", {
                                type: "closed",
                                opensAt: e.target.value,
                            })
                        }
                        placeholder={t("communitySettings.details.opensAt")}
                    />
                )}
            </div>

            <h3 className="font-semibold neon-text">
                {t("communitySettings.details.address")}
            </h3>

            <Input
                value={form.address?.city ?? ""}
                onChange={e =>
                    updateField("address", {
                        ...form.address,
                        city: e.target.value,
                    })
                }
                placeholder={t("communitySettings.details.city")}
            />

            <Input
                value={form.address?.street ?? ""}
                onChange={e =>
                    updateField("address", {
                        ...form.address,
                        street: e.target.value,
                    })
                }
                placeholder={t("communitySettings.details.street")}
            />

            <Input
                value={form.address?.building ?? ""}
                onChange={e =>
                    updateField("address", {
                        ...form.address,
                        building: e.target.value,
                    })
                }
                placeholder={t("communitySettings.details.building")}
            />

            <h3 className="font-semibold neon-text">
                {t("communitySettings.details.contacts")}
            </h3>

            <Input
                value={form.contacts?.email ?? ""}
                onChange={e =>
                    updateField("contacts", {
                        ...form.contacts,
                        email: e.target.value,
                    })
                }
                placeholder={t("communitySettings.details.email")}
            />

            <Input
                value={form.contacts?.phone ?? ""}
                onChange={e =>
                    updateField("contacts", {
                        ...form.contacts,
                        phone: e.target.value,
                    })
                }
                placeholder={t("communitySettings.details.phone")}
            />

            <Input
                value={form.contacts?.telegram ?? ""}
                onChange={e =>
                    updateField("contacts", {
                        ...form.contacts,
                        telegram: e.target.value,
                    })
                }
                placeholder={t("communitySettings.details.telegram")}
            />

            <Input
                value={form.contacts?.vk ?? ""}
                onChange={e =>
                    updateField("contacts", {
                        ...form.contacts,
                        vk: e.target.value,
                    })
                }
                placeholder={t("communitySettings.details.vk")}
            />

            <Input
                value={form.contacts?.website ?? ""}
                onChange={e =>
                    updateField("contacts", {
                        ...form.contacts,
                        website: e.target.value,
                    })
                }
                placeholder={t("communitySettings.details.website")}
            />

            <div className="flex gap-4 mt-4">

                <Button
                    onClick={async () => {
                        await update(id!, form);
                        navigate(`/communities/${id}`);
                    }}
                >
                    {t("communitySettings.details.saveDetails")}
                </Button>

                <Button
                    onClick={() => navigate(`/communities/${id}`)}
                >
                    {t("communitySettings.details.cancel")}
                </Button>

            </div>
        </Card>
    );
}