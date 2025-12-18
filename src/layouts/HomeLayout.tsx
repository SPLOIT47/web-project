import {Outlet} from "react-router-dom";

export default function HomeLayout() {
    return (
        <div className="flex gap-6 h-full">

            <main className="flex-1 min-w-0 max-w-2xl">
                <Outlet />
            </main>
        </div>
    );
}