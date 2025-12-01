import { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ThemeProvider from "@context/ThemeContext";
import LanguageProvider from "@context/LanguageContext";

import AuthPage from "@pages/auth/AuthPage";
import HomePage from "@pages/home/HomePage";
import SettingsPage from "@pages/settings/SettingsPage";

import MainLayout from "@layouts/MainLayout";
import ProfilePage from "@pages/profile/ProfilePage";
import MessagesPage from "@pages/messages/MessagesPage";
import FriendsPage from "@pages/friends/FriendsPage";
import CommunitiesPage from "@pages/community/CommunitiesPage";
import CommunityPage from "@pages/community/CommunityPage";
import CommunitySettingsPage from "@components/community/CommunitySettingsPage";
import CreateCommunityPage from "@pages/community/CreateCommunityPage";

export default function App() {
    return (
        <ThemeProvider>
            <LanguageProvider>
                <BrowserRouter>
                    <Suspense fallback={<div className="text-center p-6">Loading...</div>}>
                        <Routes>

                            <Route path="/" element={<AuthPage />} />

                            <Route element={<MainLayout />}>
                                <Route path="/home" element={<HomePage />} />
                                <Route path="/settings" element={<SettingsPage />} />
                                <Route path="/profile" element={<ProfilePage />} />
                                <Route path="/messages" element={<MessagesPage />} />
                                <Route path="/friends" element={<FriendsPage />} />
                                <Route path="/community" element={<CommunitiesPage />} />
                                <Route path="/community/:id" element={<CommunityPage />} />
                                <Route path="/communities/create" element={<CreateCommunityPage />} />
                                <Route path="/community/:id/settings" element={<CommunitySettingsPage />} />
                            </Route>

                        </Routes>
                    </Suspense>
                </BrowserRouter>
            </LanguageProvider>
        </ThemeProvider>
    );
}