/** Gateway base URL, e.g. http://localhost:4000 (no trailing slash). */
export function getApiBase(): string {
    const raw = import.meta.env.VITE_API_BASE_URL ?? "";
    return raw.replace(/\/$/, "");
}
