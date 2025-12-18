import type { User } from "@/domain/user/User";

export function getUserDisplayName(user: User): string {
    const name = user.name ?? "";
    const surname = user.surname ?? "";

    return [name, surname]
        .filter(Boolean)
        .join(" ");
}