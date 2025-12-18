import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export default function RootRedirect() {
    const user = useAuthStore(s => s.user);
    return <Navigate to={user ? "/home" : "/auth"} replace />;
}