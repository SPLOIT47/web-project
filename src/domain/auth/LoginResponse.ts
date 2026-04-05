import type { User } from "../user/User";

export interface LoginResponse {
    user: User;
    accessToken: string;
}