import { useTranslation } from "react-i18next";
import Card from "@components/ui/Card";
import Button from "@components/ui/Button";

export default function SettingsDelete() {
    const { t } = useTranslation();

    return (
        <Card className="border-red-500">

            <h2 className="text-xl font-semibold neon-text mb-3">{t("communitySettings.delete.title")}</h2>

            <p className="opacity-80 mb-4">
                {t("communitySettings.delete.warning")}
            </p>

            <Button className="bg-red-600 hover:bg-red-700">
                {t("communitySettings.delete.confirm")}
            </Button>

        </Card>
    );
}