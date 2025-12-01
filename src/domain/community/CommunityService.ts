import type { Community } from "./Community";
import type { Post } from "../post/Post";

export interface CommunityService {
    getById(id: string): Promise<Community | null>;
    getAll(): Promise<Community[]>;
    getPosts(id: string): Promise<Post[]>;
    create(data: Partial<Community>): Promise<Community>;
    follow(communityId: string, userId: string): Promise<void>;
    unfollow(communityId: string, userId: string): Promise<void>;
    update(communityId: string, data: Partial<Community>): Promise<Community | null>;
}