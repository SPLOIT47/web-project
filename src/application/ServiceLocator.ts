import type { PostService } from "@/application/post/PostService";
import type { UserService } from "@/application/user/UserService";
import type { CommunityService } from "@/application/community/CommunityService";

import { MockPostService } from "@/infrastructure/mock/MockPostService";
import { MockUserService } from "@/infrastructure/mock/MockUserService";
import { MockChatService } from "@/infrastructure/mock/MockChatService";
import { MockCommunityService } from "@/infrastructure/mock/MockCommunityService";
import {MockAuthService} from "@/infrastructure/mock/MockAuthService";
import {AuthService} from "@/application/auth/AuthService";
import {MockFileService} from "@/infrastructure/mock/MockFileService";
import {SearchService} from "@/application/search/SearchService";
import {MockSearchService} from "@/infrastructure/mock/mockSearchService";
import {CommunityDetailsService} from "@/application/chat/details/CommunityDetailsService";
import {MockCommunityDetailsService} from "@/infrastructure/mock/mockCommunityDetailsService";
import {ChatService} from "@/application/chat/ChatService";
import {FileService} from "@/application/file/FileService";

export class ServiceLocator {
    static postService: PostService = new MockPostService();
    static userService: UserService = new MockUserService();
    static chatService: ChatService = new MockChatService();
    static communityService: CommunityService = new MockCommunityService();
    static authService: AuthService = new MockAuthService();
    static fileService: FileService = new MockFileService();
    static searchService: SearchService = new MockSearchService();
    static communityDetailsService: CommunityDetailsService = new MockCommunityDetailsService();

    static useMockBackend() {
        this.postService = new MockPostService();
        this.userService = new MockUserService();
        this.chatService = new MockChatService();
        this.communityService = new MockCommunityService();
        this.authService = new MockAuthService();
        this.fileService = new MockFileService();
        this.searchService = new MockSearchService();
        this.communityDetailsService = new MockCommunityDetailsService();
    }

    static useRealBackend() {
        throw new Error("Real backend is not implemented yet");
    }
}