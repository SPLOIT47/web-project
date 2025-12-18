import { useTranslation } from "react-i18next";
import Card from "@components/ui/Card";
import Input from "@components/ui/Input";
import Button from "@components/ui/Button";

export default function SettingsGeneral() {
    const { t } = useTranslation();

    return (
        <Card className="flex flex-col gap-4">

            <Input placeholder={t("communitySettings.general.communityName")} />

            <div className="flex flex-col">
                <label className="opacity-80 mb-1">{t("communitySettings.general.category")}</label>
                <select className="p-3 rounded bg-[var(--bg-surface)] border border-[var(--border-color)]">
                    <option>{t("createCommunity.categoryTechnology")}</option>
                    <option>{t("createCommunity.categoryDesign")}</option>
                    <option>{t("createCommunity.categoryEducation")}</option>
                </select>
            </div>

            <div>
                <label className="opacity-80 mb-1 block">{t("communitySettings.general.description")}</label>
                <textarea
                    className="
                        w-full p-3 h-32 rounded
                        bg-[var(--bg-surface)]
                        border border-[var(--border-color)]
                    "
                />
            </div>

            <Button>{t("communitySettings.general.save")}</Button>

        </Card>
    );
}