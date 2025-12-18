import Header from "@components/layout/Header";
import {Outlet} from "react-router-dom";
import ModalRoot from "@components/modal/ModalRoot";

export default function AppLayout() {
    return (
        <div className="h-screen bg-[var(--bg-main)] text-[var(--text-main)] hitech-bg overflow-hidden">
            <Header />
            <div className="pt-14 tablet:pt-16 laptop:pt-20 h-full overflow-y-auto">
                <Outlet />
                <ModalRoot />
            </div>
        </div>
    );
}