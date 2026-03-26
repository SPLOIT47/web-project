/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string;
    /** When "true", use in-browser mock DB + mock services (Messenger still mocked). */
    readonly VITE_USE_MOCK_BACKEND: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

declare global {
    interface Window {
        __APP_CONFIG__?: {
            /**
             * Runtime API base URL (no trailing slash).
             * If empty, frontend will use same-origin relative URLs (e.g. `/api/...`).
             */
            apiBaseUrl?: string;
        };
    }
}

export {};
