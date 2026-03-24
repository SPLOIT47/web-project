import type { CommunityService } from "@/application/community/CommunityService";
import type { Community } from "@/domain/community/Community";
import type { Post } from "@/domain/post/Post";
import type { CreateCommunityPayload } from "@/domain/community/CreateCommunityPayload";
import { httpRequest } from "./httpClient";
import {
    type CommunityRow,
    type ContentPostListRow,
    type MemberRow,
    contentPostListRowToCommunityPost,
    mapCommunityRow,
} from "./mappers";

export class HttpCommunityService implements CommunityService {
    async getById(id: string): Promise<Community | null> {
        try {
            const row = await httpRequest<CommunityRow>(
                `/api/communities/${encodeURIComponent(id)}`,
            );
            const members = await httpRequest<MemberRow[]>(
                `/api/communities/${encodeURIComponent(id)}/members`,
            );
            return mapCommunityRow(row, members);
        } catch {
            return null;
        }
    }

    async getAll(): Promise<Community[]> {
        const rows = await httpRequest<CommunityRow[]>(
            "/api/communities/search",
        );
        const out: Community[] = [];
        for (const row of rows) {
            try {
                const members = await httpRequest<MemberRow[]>(
                    `/api/communities/${encodeURIComponent(row.communityId)}/members`,
                );
                out.push(mapCommunityRow(row, members));
            } catch {
                out.push(mapCommunityRow(row, []));
            }
        }
        return out;
    }

    async getMine(_userId: string): Promise<Community[]> {
        const rows = await httpRequest<CommunityRow[]>("/api/communities/me");
        const out: Community[] = [];
        for (const row of rows) {
            try {
                const members = await httpRequest<MemberRow[]>(
                    `/api/communities/${encodeURIComponent(row.communityId)}/members`,
                );
                out.push(mapCommunityRow(row, members));
            } catch {
                out.push(mapCommunityRow(row, []));
            }
        }
        return out;
    }

    async getPosts(communityId: string): Promise<Post[]> {
        const rows = await httpRequest<ContentPostListRow[]>(
            `/api/posts/user/${encodeURIComponent(communityId)}?limit=50&offset=0`,
        );
        return rows.map(row =>
            contentPostListRowToCommunityPost(row, communityId),
        );
    }

    async create(
        data: CreateCommunityPayload,
        _creatorId: string,
    ): Promise<Community> {
        const row = await httpRequest<CommunityRow>("/api/communities", {
            method: "POST",
            body: JSON.stringify({
                name: data.name,
                type: data.type,
                category: data.category,
                description: data.description,
                avatarUrl: data.avatarUrl,
                coverUrl: data.coverUrl,
            }),
        });
        const members = await httpRequest<MemberRow[]>(
            `/api/communities/${encodeURIComponent(row.communityId)}/members`,
        );
        return mapCommunityRow(row, members);
    }

    async follow(communityId: string, userId: string): Promise<void> {
        await httpRequest(
            `/api/communities/${encodeURIComponent(communityId)}/join`,
            { method: "POST" },
        );
    }

    async unfollow(communityId: string, userId: string): Promise<void> {
        await httpRequest(
            `/api/communities/${encodeURIComponent(communityId)}/join`,
            { method: "DELETE" },
        );
    }

    async update(
        communityId: string,
        data: Partial<Omit<Community, "id" | "createdAt">>,
    ): Promise<Community | null> {
        const body: Record<string, string> = {};
        if (data.name !== undefined) body.name = data.name;
        if (data.type !== undefined) body.type = String(data.type);
        if (data.category !== undefined) body.category = data.category;
        if (data.description !== undefined) body.description = data.description ?? "";
        if (data.avatarUrl !== undefined) body.avatarUrl = data.avatarUrl;
        if (data.coverUrl !== undefined) body.coverUrl = data.coverUrl;

        const row = await httpRequest<CommunityRow>(
            `/api/communities/${encodeURIComponent(communityId)}`,
            {
                method: "PATCH",
                body: JSON.stringify(body),
            },
        );
        const members = await httpRequest<MemberRow[]>(
            `/api/communities/${encodeURIComponent(communityId)}/members`,
        );
        return mapCommunityRow(row, members);
    }

    async delete(id: string): Promise<void> {
        await httpRequest(`/api/communities/${encodeURIComponent(id)}`, {
            method: "DELETE",
        });
    }
}
