import {LoginRequest} from "@/domain/auth/LoginRequest";
import {LoginResponse} from "@/domain/auth/LoginResponse";
import {RegisterResponse} from "@/domain/auth/RegisterResponse";
import {RegisterRequest} from "@/domain/auth/RegisterRequest";
import type { UpdateCredentialsPayload } from "@/domain/auth/UpdateCredentialsPayload";

export type AuthCredentialsUpdated = {
    userId: string;
    login: string;
    email: string;
};

export interface AuthService {
    login(data: LoginRequest): Promise<LoginResponse | null>;
    register(data: RegisterRequest): Promise<RegisterResponse | null>;
    logout(): Promise<void>;
    getCurrentSession(): Promise<LoginResponse | null>;
    deleteAccount(userId: string): Promise<void>;
    updateCredentials(
        payload: UpdateCredentialsPayload,
    ): Promise<AuthCredentialsUpdated>;
}