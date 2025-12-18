import Sidebar from "@components/layout/Sidebar";
import { Outlet } from "react-router-dom";
import { useAuthStore } from "@/store";
import { useEffect } from "react";

export default function MainLayout() {
    return (
        <div className="
            w-full mx-auto 
            px-2 mobile:px-3 tablet:px-4 laptop:px-6 
            flex gap-3 tablet:gap-4 laptop:gap-6 
            h-full
            max-w-full mobile:max-w-full tablet:max-w-4xl laptop:max-w-6xl desktop:max-w-7xl wide:max-w-[90rem]
        ">

            <aside className="
                hidden laptop:block 
                w-0 laptop:w-56 desktop:w-64 
                shrink-0
            ">
                <Sidebar />
            </aside>

            <main className="flex-1 min-w-0 w-full">
                <Outlet />
            </main>

        </div>
    );
}