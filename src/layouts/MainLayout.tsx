import Header from "@components/layout/Header";
import { Outlet } from "react-router-dom";
import { useAuthStore } from "@/store";
import { useEffect } from "react";

export default function MainLayout() {
    const loading = useAuthStore((s) => s.loading);

    useEffect(() => {
        useAuthStore.getState().restoreSession();
    }, []);

    if (loading) {
        return (
            <div className="p-6 text-center opacity-60">
                Restoring session...
            </div>
        );
    }

    return (
        <div className="h-screen overflow-hidden bg-[var(--bg-main)] text-[var(--text-main)] hitech-bg">
            <Header />
            <div className="pt-20 h-full">
                <Outlet />
            </div>
        </div>
    );
}