import type { AuthCredentialsUpdated, AuthService } from "@/application/auth/AuthService";
import type { UpdateCredentialsPayload } from "@/domain/auth/UpdateCredentialsPayload";
import type { LoginRequest } from "@/domain/auth/LoginRequest";
import type { LoginResponse } from "@/domain/auth/LoginResponse";
import type { RegisterRequest } from "@/domain/auth/RegisterRequest";
import type { RegisterResponse } from "@/domain/auth/RegisterResponse";
import { httpRequest } from "./httpClient";
import { getStoredToken, setStoredToken } from "./tokenStorage";
import {
    type ApiUserPayload,
    type MeProfileResponse,
    mergeProfile,
    userFromAuthPayload,
} from "./mappers";

type AuthApiResponse = {
    user: ApiUserPayload;
    token: string;
};

type MeAuthResponse = {
    userId: string;
    login: string;
    email: string;
};

export class HttpAuthService implements AuthService {
    async login(data: LoginRequest): Promise<LoginResponse | null> {
        try {
            const res = await httpRequest<AuthApiResponse>("/api/auth/login", {
                method: "POST",
                body: JSON.stringify({
                    identifier: data.identifier,
                    password: data.password,
                }),
            });
            setStoredToken(res.token);
            const user = await this.loadUserWithProfile(res.user);
            return { user, token: res.token };
        } catch {
            return null;
        }
    }

    async register(data: RegisterRequest): Promise<RegisterResponse | null> {
        if (!data.password) {
            return null;
        }
        try {
            const res = await httpRequest<AuthApiResponse>("/api/auth/register", {
                method: "POST",
                body: JSON.stringify({
                    login: data.username,
                    email: data.email,
                    password: data.password,
                    name: data.name,
                    surname: data.surname,
                }),
            });
            setStoredToken(res.token);
            const user = await this.loadUserWithProfile(res.user);
            return { user, token: res.token };
        } catch {
            return null;
        }
    }

    async logout(): Promise<void> {
        try {
            await httpRequest("/api/auth/logout", { method: "POST" });
        } catch {
            /* сервер мог не принять cookie (старый path) — локальный выход всё равно нужен */
        } finally {
            setStoredToken(null);
        }
    }

    async getCurrentSession(): Promise<LoginResponse | null> {
        const token = getStoredToken();
        if (!token) {
            return null;
        }
        try {
            const me = await httpRequest<MeAuthResponse>("/api/auth/me");
            const prof = await httpRequest<MeProfileResponse>("/api/profiles/me");
            let user = userFromAuthPayload({
                userId: me.userId,
                login: me.login,
                email: me.email,
            });
            if (prof.status === "READY" && prof.profile) {
                user = mergeProfile(user, prof.profile);
            }
            return { user, token };
        } catch {
            setStoredToken(null);
            return null;
        }
    }

    async deleteAccount(_userId: string): Promise<void> {
        await httpRequest("/api/auth/me", { method: "DELETE" });
        setStoredToken(null);
    }

    async updateCredentials(
        payload: UpdateCredentialsPayload,
    ): Promise<AuthCredentialsUpdated> {
        return httpRequest<AuthCredentialsUpdated>("/api/auth/update", {
            method: "PUT",
            body: JSON.stringify(payload),
        });
    }

    private async loadUserWithProfile(authUser: ApiUserPayload) {
        let user = userFromAuthPayload(authUser);
        try {
            const prof = await httpRequest<MeProfileResponse>("/api/profiles/me");
            if (prof.status === "READY" && prof.profile) {
                user = mergeProfile(user, prof.profile);
            }
        } catch {
            /* profile may still be PENDING */
        }
        return user;
    }
}
