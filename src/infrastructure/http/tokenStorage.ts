const KEY = "access_token";

function normalizeAccessToken(raw: string): string {
    let t = raw.trim();
    for (let i = 0; i < 5; i++) {
        const m = /^Bearer\s+/i.exec(t);
        if (!m) break;
        t = t.slice(m[0].length).trim();
    }
    return t;
}

export function getStoredToken(): string | null {
    try {
        const raw = localStorage.getItem(KEY);
        if (!raw) return null;
        const t = normalizeAccessToken(raw);
        return t.length > 0 ? t : null;
    } catch {
        return null;
    }
}

export function setStoredToken(token: string | null): void {
    try {
        if (token) {
            const t = normalizeAccessToken(token);
            if (t.length > 0) {
                localStorage.setItem(KEY, t);
            } else {
                localStorage.removeItem(KEY);
            }
        } else {
            localStorage.removeItem(KEY);
        }
    } catch {
        /* ignore */
    }
}
