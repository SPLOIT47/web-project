import { useTranslation } from "react-i18next";
import Card from "@components/ui/Card";
import Button from "@components/ui/Button";
import Icon from "@components/ui/Icon";

export default function SettingsAppearance() {
    const { t } = useTranslation();

    return (
        <Card className="flex flex-col gap-6">

            <div>
                <label className="opacity-80 mb-1 block">{t("communitySettings.appearance.avatar")}</label>
                <div className="flex items-center gap-3">
                    <div className="w-24 h-24 rounded-xl bg-gray-600/20"></div>
                    <Button className="flex gap-2 items-center">
                        <Icon name="upload" />
                        {t("communitySettings.appearance.uploadAvatar")}
                    </Button>
                </div>
            </div>

            <div>
                <label className="opacity-80 mb-1 block">{t("communitySettings.appearance.cover")}</label>
                <div className="w-full h-32 rounded-xl bg-gray-600/20 mb-2"></div>
                <Button className="flex gap-2 items-center">
                    <Icon name="upload" />
                    {t("communitySettings.appearance.uploadCover")}
                </Button>
            </div>

        </Card>
    );
}