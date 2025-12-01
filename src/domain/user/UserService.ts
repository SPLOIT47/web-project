import type { User } from "./User";

export interface UserService {
    getById(id: string): Promise<User | null>;
    getAll(): Promise<User[]>;
    follow(userId: string, targetId: string): Promise<void>;
    unfollow(userId: string, targetId: string): Promise<void>;
}