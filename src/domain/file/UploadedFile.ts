import { Identifiable } from "@/domain/common/Identifiable";
import { Timestamped } from "@/domain/common/Timestamped";

export interface UploadedFile extends Identifiable, Timestamped {
    url: string;

    name: string;

    size: number;

    type: string;
}