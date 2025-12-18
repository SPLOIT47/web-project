import type { Community } from "@/domain/community/Community";
import type { Post } from "@/domain/post/Post";
import type { CreateCommunityPayload } from "@/domain/community/CreateCommunityPayload";

export interface CommunityService {
    getById(id: string): Promise<Community | null>;
    getAll(): Promise<Community[]>;

    getPosts(id: string): Promise<Post[]>;

    create(data: CreateCommunityPayload, creatorId: string): Promise<Community>;

    follow(communityId: string, userId: string): Promise<void>;
    unfollow(communityId: string, userId: string): Promise<void>;

    update(
        communityId: string,
        data: Partial<Omit<Community, "id" | "createdAt">>
    ): Promise<Community | null>;

    delete(id: string): Promise<void>;
}