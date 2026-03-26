/**
 * Gateway base URL (no trailing slash).
 *
 * - For same-origin deployments behind nginx (recommended): keep empty → requests go to `/api/...`
 * - For local dev: set e.g. `http://localhost:4000`
 */
export function getApiBase(): string {
    const runtimeRaw = String((window as any)?.__APP_CONFIG__?.apiBaseUrl ?? "").trim();
    const buildtimeRaw = String(import.meta.env.VITE_API_BASE_URL ?? "").trim();
    const raw = runtimeRaw || buildtimeRaw;
    if (!raw) return "";
    return raw.replace(/\/$/, "");
}
