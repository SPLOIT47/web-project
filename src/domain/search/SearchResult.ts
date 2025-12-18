import type { User } from "@/domain/user/User";

export type SearchResult =
    | {
    type: "user";
    user: User;
}
    | {
    type: "community";
    community: any;
};