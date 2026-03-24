export type PostAuthor =
    | { type: "user"; userId: string }
    /** senderUserId may be unknown when coming from feed read-model only */
    | { type: "community"; communityId: string; senderUserId?: string };