import {Suspense, useEffect} from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ThemeProvider from "@context/ThemeContext";
import LanguageProvider from "@context/LanguageContext";

import AuthPage from "@pages/auth/AuthPage";
import HomePage from "@pages/home/HomePage";
import SettingsPage from "@pages/settings/SettingsPage";

import MainLayout from "@layouts/MainLayout";
import ProfilePage from "@pages/profile/ProfilePage";
import MessagesPage from "@pages/messages/MessengerPage";
import FriendsPage from "@pages/friends/FriendsPage";
import CommunitiesPage from "@pages/community/CommunitiesPage";
import CommunityPage from "@pages/community/CommunityPage";
import CommunitySettingsPage from "@components/community/CommunitySettingsPage";
import CreateCommunityPage from "@pages/community/CreateCommunityPage";
import {useAuthStore} from "@/store/authStore";
import AppLayout from "@layouts/AppLayout";
import HomeLayout from "@layouts/HomeLayout";
import CommunityLayout from "@layouts/CommunityLayout";
import {useChatStore, useUserStore} from "@/store";
import RootRedirect from "@pages/RootRedirect";
import ProtectedRoute from "@/route/ProtectedRoute";

export default function App() {
    const restoreSession = useAuthStore(s => s.restoreSession);
    const loadUsers = useUserStore(s => s.loadAll);
    const loadUserChats = useChatStore(s => s.loadUserChats);
    const user = useAuthStore(s => s.user);

    useEffect(() => {
        (async () => {
            await loadUsers();
            await loadUserChats();
        })();
    }, []);

    return (
        <ThemeProvider>
            <LanguageProvider>
                <BrowserRouter>
                    <Suspense fallback={<div className="text-center p-6">Loading...</div>}>
                        <Routes>
                            <Route path="/" element={<RootRedirect />} />
                            <Route path="/auth" element={<AuthPage />} />

                            <Route element={<ProtectedRoute />}>
                                <Route element={<AppLayout />}>
                                    <Route element={<MainLayout />}>

                                        <Route path="/home" element={<HomeLayout />}>
                                            <Route index element={<HomePage />} />
                                        </Route>

                                        <Route path="/settings" element={<SettingsPage />} />
                                        <Route path="/profile" element={<ProfilePage />} />
                                        <Route path="/profile/:id" element={<ProfilePage />} />
                                        <Route path="/messages" element={<MessagesPage mode="user" />} />
                                        <Route path="/friends" element={<FriendsPage />} />

                                        <Route path="/communities" element={<CommunitiesPage />} />
                                        <Route path="/communities/create" element={<CreateCommunityPage />} />
                                        <Route path="/communities/:id/chat" element={<MessagesPage mode="community" />}/>

                                        <Route element={<CommunityLayout />}>
                                            <Route path="/communities/:id" element={<CommunityPage />} />
                                            <Route path="/communities/:id/settings" element={<CommunitySettingsPage />} />
                                        </Route>

                                    </Route>
                                </Route>
                            </Route>

                        </Routes>
                    </Suspense>
                </BrowserRouter>
            </LanguageProvider>
        </ThemeProvider>
    );
}