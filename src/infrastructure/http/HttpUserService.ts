import type { UserService } from "@/application/user/UserService";
import type { User } from "@/domain/user/User";
import type { EditProfilePayload } from "@/domain/user/EditProfilePayload";
import { isUuidString } from "@/utils/uuid";
import { HttpError, httpRequest } from "./httpClient";
import {
    type ApiProfile,
    mapApiProfileToUser,
    userFromAuthPayload,
} from "./mappers";

type BatchProfilesResponse = { profiles: ApiProfile[] };

type SearchProfilesResponse = {
    results: ApiProfile[];
    hasMore: boolean;
    nextOffset: number;
};

type FriendIdsResponse = { friends: string[] };

type FriendRequestRow = {
    requesterUserId: string;
    targetUserId: string;
    status: string;
};

export class HttpUserService implements UserService {
    async getById(id: string): Promise<User | null> {
        try {
            const p = await httpRequest<ApiProfile>(`/api/profiles/${id}`);
            return mapApiProfileToUser(p);
        } catch {
            return null;
        }
    }

    async getAll(): Promise<User[]> {
        return [];
    }

    async getBatch(ids: string[]): Promise<User[]> {
        if (import.meta.env.DEV) {
            console.debug("[profiles/batch] raw ids", ids);
        }
        const normalized = ids
            .map((id) => (typeof id === "string" ? id.trim() : ""))
            .filter(Boolean);
        const unique = [...new Set(normalized)];
        const valid = unique.filter(isUuidString);
        if (import.meta.env.DEV) {
            const invalid = unique.filter((id) => !isUuidString(id));
            console.debug("[profiles/batch] normalized", unique);
            console.debug("[profiles/batch] valid", valid);
            if (invalid.length > 0) {
                console.warn("[profiles/batch] invalid ids filtered", invalid);
            }
        }
        if (valid.length === 0) return [];
        try {
            const res = await httpRequest<BatchProfilesResponse>("/api/profiles/batch", {
                method: "POST",
                body: JSON.stringify({ ids: valid }),
            });
            return res.profiles.map(p => mapApiProfileToUser(p));
        } catch (e) {
            // Some environments may occasionally produce mixed/non-UUID ids in upstream services.
            // Do not crash feed/friends screens on this validation error.
            if (
                e instanceof HttpError &&
                e.status === 400 &&
                typeof e.message === "string" &&
                e.message.toLowerCase().includes("uuid")
            ) {
                if (import.meta.env.DEV) {
                    console.error("[profiles/batch] backend 400 uuid", {
                        sent: valid,
                        error: e.body ?? e.message,
                    });
                }
                return [];
            }
            throw e;
        }
    }

    async search(query: string): Promise<User[]> {
        const q = query.trim();
        if (!q) return [];
        const res = await httpRequest<SearchProfilesResponse>(
            `/api/profiles/search?q=${encodeURIComponent(q)}&limit=20&offset=0`,
        );
        return res.results.map(p => mapApiProfileToUser(p));
    }

    async follow(_userId: string, _targetId: string): Promise<void> {
        /* Not implemented on backend (no follow graph); keep no-op for UI compatibility */
    }

    async unfollow(_userId: string, _targetId: string): Promise<void> {
        /* no-op */
    }

    async updateProfile(id: string, data: EditProfilePayload): Promise<User> {
        const me = await httpRequest<{ userId: string; login: string; email: string }>(
            "/api/auth/me",
        );
        if (me.userId !== id) {
            throw new Error("Can only update own profile");
        }
        const patchBody: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(data)) {
            if (value === undefined) continue;
            if (key === "birthday" && value === "") continue;
            patchBody[key] = value;
        }

        const updated = await httpRequest<ApiProfile>("/api/profiles/me", {
            method: "PATCH",
            body: JSON.stringify(patchBody),
        });
        return mapApiProfileToUser(updated, {
            userId: me.userId,
            login: me.login,
            email: me.email,
        });
    }

    async getFriends(userId: string): Promise<User[]> {
        const { friends } = await httpRequest<FriendIdsResponse>("/api/friends/me");
        const others = friends.filter(id => id !== userId);
        return this.getBatch(others);
    }

    async getIncomingRequests(userId: string): Promise<User[]> {
        const rows = await httpRequest<FriendRequestRow[]>(
            "/api/friends/requests/incoming",
        );
        const ids = rows
            .map((r) => r?.requesterUserId)
            .filter((id): id is string => typeof id === "string" && isUuidString(id) && id !== userId);
        return this.getBatch(ids);
    }

    async getOutgoingRequests(userId: string): Promise<User[]> {
        const rows = await httpRequest<FriendRequestRow[]>(
            "/api/friends/requests/outgoing",
        );
        const ids = rows
            .map((r) => r?.targetUserId)
            .filter((id): id is string => typeof id === "string" && isUuidString(id));
        return this.getBatch(ids);
    }

    async sendFriendRequest(fromId: string, toId: string): Promise<void> {
        await httpRequest(`/api/friends/requests/${encodeURIComponent(toId)}`, {
            method: "POST",
        });
    }

    async acceptFriendRequest(userId: string, fromId: string): Promise<void> {
        await httpRequest(
            `/api/friends/requests/${encodeURIComponent(fromId)}/accept`,
            { method: "POST" },
        );
    }

    async declineFriendRequest(userId: string, fromId: string): Promise<void> {
        await httpRequest(
            `/api/friends/requests/${encodeURIComponent(fromId)}/decline`,
            { method: "POST" },
        );
    }

    async removeFriend(userId: string, friendId: string): Promise<void> {
        await httpRequest(`/api/friends/${encodeURIComponent(friendId)}`, {
            method: "DELETE",
        });
    }

    async cancelFriendRequest(fromId: string, toId: string): Promise<void> {
        await httpRequest(
            `/api/friends/requests/${encodeURIComponent(toId)}`,
            { method: "DELETE" },
        );
    }
}
