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
import { HttpAuthService } from "@/infrastructure/http/HttpAuthService";
import { HttpUserService } from "@/infrastructure/http/HttpUserService";
import { HttpPostService } from "@/infrastructure/http/HttpPostService";
import { HttpCommunityService } from "@/infrastructure/http/HttpCommunityService";
import { HttpFileService } from "@/infrastructure/http/HttpFileService";
import { HttpSearchService } from "@/infrastructure/http/HttpSearchService";
import { HttpCommunityDetailsService } from "@/infrastructure/http/HttpCommunityDetailsService";

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
        this.postService = new HttpPostService();
        this.userService = new HttpUserService();
        this.chatService = new MockChatService();
        this.communityService = new HttpCommunityService();
        this.authService = new HttpAuthService();
        this.fileService = new HttpFileService();
        this.searchService = new HttpSearchService();
        this.communityDetailsService = new HttpCommunityDetailsService();
    }
}