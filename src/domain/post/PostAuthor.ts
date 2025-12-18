export type PostAuthor =
    | { type: "user"; userId: string }
    | { type: "community"; communityId: string; senderUserId: string };