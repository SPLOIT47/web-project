import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

type Props = {
    redirectTo?: string;
};

export default function ProtectedRoute({
                                           redirectTo = "/",
                                       }: Props) {
    const user = useAuthStore(s => s.user);
    const location = useLocation();

    if (!user) {
        return (
            <Navigate
                to={redirectTo}
                replace
                state={{ from: location }}
            />
        );
    }

    return <Outlet />;
}