import type { PostService } from "@/domain/post/PostService";
import type { UserService } from "@/domain/user/UserService";
import type { ChatService } from "@/domain/chat/ChatService";
import type { CommunityService } from "@/domain/community/CommunityService";

import { MockPostService } from "@/infrastructure/mock/MockPostService";
import { MockUserService } from "@/infrastructure/mock/MockUserService";
import { MockChatService } from "@/infrastructure/mock/MockChatService";
import { MockCommunityService } from "@/infrastructure/mock/MockCommunityService";
import {MockAuthService} from "@/infrastructure/mock/MockAuthService";
import {AuthService} from "@/domain/auth/AuthService";

export class ServiceLocator {
    static postService: PostService = new MockPostService();
    static userService: UserService = new MockUserService();
    static chatService: ChatService = new MockChatService();
    static communityService: CommunityService = new MockCommunityService();
    static authService: AuthService = new MockAuthService();

    static useMockBackend() {
        this.postService = new MockPostService();
        this.userService = new MockUserService();
        this.chatService = new MockChatService();
        this.communityService = new MockCommunityService();
        this.authService = new MockAuthService();
    }

    static useRealBackend() {
        throw new Error("Real backend is not implemented yet");
    }
}