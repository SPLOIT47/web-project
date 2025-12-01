import { Identifiable } from "@/domain/common/Identifiable";
import { Timestamped } from "@/domain/common/Timestamped";

export interface Post extends Identifiable, Timestamped {
    authorId: string;
    content: string;
    images?: string[];

    likes: string[];
    comments: string[];
}