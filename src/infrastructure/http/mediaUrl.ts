import { getApiBase } from "./apiConfig";
import { isUuidString } from "@/utils/uuid";

/**
 * Поддержка двух форматов ссылок в БД:
 * - старый: абсолютный URL
 * - новый: mediaId (UUID)
 */
export function resolveMediaRef(ref?: string | null): string | undefined {
    const value = (ref ?? "").trim();
    if (!value) {
        return undefined;
    }
    if (isUuidString(value)) {
        const base = getApiBase();
        return `${base}/api/media/${encodeURIComponent(value)}/download`;
    }
    return value;
}

