export type CreateChatPayload =
    | {
    type: "private";
    members: [string, string];
}
    | {
    type: "group";
    title: string;
    members: string[];
};