import { useState } from "react";
import CommunitiesTabs from "@components/community/CommunitiesTabs";
import CommunitiesList from "@components/community/CommunitiesList";
import Icon from "@/components/ui/Icon";
import Button from "@components/ui/Button";
import {useNavigate} from "react-router-dom";

export default function CommunitiesPage() {
    const [tab, setTab] = useState<"all" | "my" | "manage" | "search">("all");
    const navigate = useNavigate();

    return (
        <div className="h-[calc(100vh-80px)] overflow-hidden p-6 text-[var(--text-main)]">

            <h1 className="text-3xl font-bold neon-text mb-6 fade-in">
                Communities
            </h1>

            <Button
                className="flex gap-2 items-center"
                onClick={() => navigate("/communities/create")}
            >
                <Icon name="plus" />
                Create Community
            </Button>

            <CommunitiesTabs active={tab} onChange={setTab} />

            <div className="h-[calc(100%-150px)] overflow-y-auto mt-4">
                <CommunitiesList tab={tab} />
            </div>

        </div>
    );
}