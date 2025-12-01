import { useState } from "react";
import SettingsTabs from "@components/community/settings/SettingsTab";
import SettingsGeneral from "@components/community/settings/SettingsGeneral";
import SettingsMembers from "@components/community/settings/SettingsMembers";
import SettingsDelete from "@components/community/settings/SettingsDelete";

export default function CommunitySettingsPage() {
    const [tab, setTab] = useState("general");

    return (
        <div className="h-[calc(100vh-80px)] overflow-y-auto p-6 text-[var(--text-main)] fade-in">
            <div className="max-w-5xl mx-auto">

                <h1 className="text-3xl font-bold neon-text mb-6">
                    Community Settings
                </h1>

                <SettingsTabs active={tab} onChange={setTab} />

                <div className="mt-6">
                    {tab === "general" && <SettingsGeneral />}
                    {tab === "appearance" && <SettingsAppearance />}
                    {tab === "members" && <SettingsMembers />}
                    {tab === "permissions" && <SettingsPermissions />}
                    {tab === "delete" && <SettingsDelete />}
                </div>

            </div>
        </div>
    );
}