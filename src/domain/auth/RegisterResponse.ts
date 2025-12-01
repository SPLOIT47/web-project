import type { User } from "../user/User";

export interface RegisterResponse {
    user: User;
    token: string;
}