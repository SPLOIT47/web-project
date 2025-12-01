import type { LoginRequest } from "./LoginRequest";
import type { LoginResponse } from "./LoginResponse";
import type { RegisterRequest } from "./RegisterRequest";
import type { RegisterResponse } from "./RegisterResponse";

export interface AuthService {
    login(data: LoginRequest): Promise<LoginResponse | null>;
    register(data: RegisterRequest): Promise<RegisterResponse | null>;
    logout(): Promise<void>;
    getCurrentSession(): Promise<LoginResponse | null>;
}