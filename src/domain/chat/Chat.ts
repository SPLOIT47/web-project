import { Identifiable } from "@/domain/common/Identifiable";
import { Timestamped } from "@/domain/common/Timestamped";

export interface Chat extends Identifiable, Timestamped {
    participants: string[];
    messages: string[];
}