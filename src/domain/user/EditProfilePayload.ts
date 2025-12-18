export type EditProfilePayload = Partial<{
    name: string;
    surname: string;
    bio: string;
    birthday: string;
    city: string;
    education: string;
    languages: string[];
    avatarUrl: string;
}>;