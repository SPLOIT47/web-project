/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string;
    /** When "true", use in-browser mock DB + mock services (Messenger still mocked). */
    readonly VITE_USE_MOCK_BACKEND: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
