import { useState } from "react";
import { useTranslation } from "react-i18next";
import CommunitiesTabs from "@components/community/CommunitiesTabs";
import CommunitiesList from "@components/community/CommunitiesList";
import Icon from "@/components/ui/Icon";
import Button from "@components/ui/Button";
import {useNavigate} from "react-router-dom";

export default function CommunitiesPage() {
    const { t } = useTranslation();
    const [tab, setTab] = useState<"all" | "my" | "manage" | "search">("all");
    const navigate = useNavigate();

    return (
        <div className="
            h-[calc(100vh-56px)] tablet:h-[calc(100vh-64px)] laptop:h-[calc(100vh-80px)] 
            overflow-hidden 
            p-3 mobile:p-4 tablet:p-6 
            text-[var(--text-main)]
        ">

            <h1 className="
                text-2xl mobile:text-3xl font-bold neon-text 
                mb-4 tablet:mb-6 
                fade-in
            ">
                {t("communities.title")}
            </h1>

            <Button
                className="
                    flex gap-2 items-center
                    text-sm tablet:text-base
                    mb-3 tablet:mb-4
                "
                onClick={() => navigate("/communities/create")}
            >
                <Icon name="plus" />
                {t("communities.createCommunity")}
            </Button>

            <CommunitiesTabs active={tab} onChange={setTab} />

            <div className="
                h-[calc(100%-140px)] mobile:h-[calc(100%-150px)] tablet:h-[calc(100%-160px)] 
                overflow-y-auto 
                mt-3 tablet:mt-4
            ">
                <CommunitiesList tab={tab} />
            </div>

        </div>
    );
}