import {UploadedFile} from "@/domain/file/UploadedFile";

export interface FileService {
    upload(file: File): Promise<UploadedFile>
}