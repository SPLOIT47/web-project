/** Тело PUT /api/auth/update (AuthService). */
export type UpdateCredentialsPayload = {
    login?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
};
