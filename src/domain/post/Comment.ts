import { Identifiable } from "@/domain/common/Identifiable";
import { Timestamped } from "@/domain/common/Timestamped";

export interface Comment extends Identifiable, Timestamped {
    authorId: string;
    text: string;
}