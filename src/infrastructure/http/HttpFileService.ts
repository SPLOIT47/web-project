import type { FileService } from "@/application/file/FileService";
import type { UploadedFile } from "@/domain/file/UploadedFile";
import { getApiBase } from "./apiConfig";
import { getStoredToken } from "./tokenStorage";
import { applyAuthToHeaders, httpRequest } from "./httpClient";

type UploadResponse = {
    mediaId: string;
    ownerUserId: string;
    originalFilename: string;
    mimeType: string;
    sizeBytes: number;
    kind: string;
    createdAt: string;
    url?: string;
};

type UrlResponse = { url: string };

export class HttpFileService implements FileService {
    async upload(file: File): Promise<UploadedFile> {
        const base = getApiBase();
        const token = getStoredToken();
        if (!token) {
            throw new Error("Not authenticated");
        }

        const form = new FormData();
        form.append("file", file);
        form.append("kind", "avatar");

        const headers = new Headers();
        applyAuthToHeaders(headers);

        const res = await fetch(`${base}/api/media/upload`, {
            method: "POST",
            body: form,
            headers,
            credentials: "include",
        });

        const text = await res.text();
        const data = text ? JSON.parse(text) : null;
        if (!res.ok) {
            throw new Error(data?.message ?? "Upload failed");
        }

        const uploaded = data as UploadResponse;
        let url = uploaded.url;
        if (!url) {
            const urlRes = await httpRequest<UrlResponse>(
                `/api/media/${encodeURIComponent(uploaded.mediaId)}/url`,
            );
            url = urlRes.url;
        }

        const created =
            typeof uploaded.createdAt === "string"
                ? uploaded.createdAt
                : new Date().toISOString();

        return {
            id: uploaded.mediaId,
            url,
            name: uploaded.originalFilename,
            size: uploaded.sizeBytes,
            type: uploaded.mimeType,
            createdAt: created,
            updatedAt: created,
        };
    }
}
