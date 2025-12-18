const STORAGE_KEY = "__mock_db__";

export type MockDB = {
    users: any[];
    communities: any[];
    chats: any[];
    messages: any[];
    posts: any[];
    communityDetails: any[];
};

const defaultDb: MockDB = {
    users: [],
    communities: [],
    chats: [],
    messages: [],
    posts: [],
    communityDetails: [],
};

export function loadDb(): MockDB {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultDb));
        return structuredClone(defaultDb);
    }

    return JSON.parse(raw);
}

export function saveDb(db: MockDB) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

export function resetDb() {
    localStorage.removeItem(STORAGE_KEY);
}