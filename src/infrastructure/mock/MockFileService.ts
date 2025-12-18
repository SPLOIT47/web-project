import { faker } from "@faker-js/faker";
import { mockResponse } from "./mockApi";

import type { UploadedFile } from "@/domain/file/UploadedFile";
import type { FileService } from "@/application/file/FileService";

import { loadDb, saveDb } from "./database";

function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () =>
            typeof reader.result === "string"
                ? resolve(reader.result)
                : reject();

        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export class MockFileService implements FileService {
    async upload(file: File): Promise<UploadedFile> {
        const db = loadDb();

        const dataUrl = await fileToDataUrl(file);
        const now = new Date().toISOString();

        const uploaded: UploadedFile = {
            id: faker.string.uuid(),
            url: dataUrl,
            name: file.name,
            size: file.size,
            type: file.type,
            createdAt: now,
            updatedAt: now,
        };

        saveDb(db);
        return mockResponse(uploaded);
    }
}