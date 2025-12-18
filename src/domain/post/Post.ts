import { Identifiable } from "@/domain/common/Identifiable";
import { Timestamped } from "@/domain/common/Timestamped";
import {Comment} from "@/domain/post/Comment";
import {PostAuthor} from "@/domain/post/PostAuthor";


export interface Post extends Identifiable, Timestamped {
    author: PostAuthor;
    content: string;
    images?: string[];

    likes: string[];
    comments: Comment[];
}