import { getApiBase } from "./apiConfig";
import { getStoredToken } from "./tokenStorage";

export function applyAuthToHeaders(headers: Headers): void {
    headers.delete("authorization");
    const token = getStoredToken();
    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }
}

export class HttpError extends Error {
    constructor(
        message: string,
        readonly status: number,
        readonly body?: unknown,
    ) {
        super(message);
        this.name = "HttpError";
    }
}

type Json = Record<string, unknown> | unknown[] | string | number | boolean | null;

export async function httpRequest<T = Json>(
    path: string,
    init: RequestInit = {},
): Promise<T> {
    const base = getApiBase();
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    // If base is empty, use same-origin relative URLs (e.g. `/api/auth/register`).
    const url = base ? `${base}${normalizedPath}` : normalizedPath;

    const headers = new Headers(init.headers);
    applyAuthToHeaders(headers);
    if (
        init.body &&
        typeof init.body === "string" &&
        !headers.has("Content-Type")
    ) {
        headers.set("Content-Type", "application/json");
    }

    const res = await fetch(url, {
        ...init,
        headers,
        credentials: "include",
    });

    if (res.status === 204) {
        return undefined as T;
    }

    const text = await res.text();
    let data: unknown = undefined;
    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            data = text;
        }
    }

    if (!res.ok) {
        const msg =
            typeof data === "object" && data !== null && "message" in data
                ? String((data as { message: unknown }).message)
                : res.statusText;
        throw new HttpError(msg || "Request failed", res.status, data);
    }

    return data as T;
}
