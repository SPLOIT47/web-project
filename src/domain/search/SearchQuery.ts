export type SearchScope =
    | "users"
    | "friends"
    | "communities";

export interface SearchQuery {
    text: string;
    scope: SearchScope;
}