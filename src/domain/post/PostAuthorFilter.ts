export type PostAuthorFilter =
    | { type: "user"; userId: string }
    | { type: "community"; communityId: string };