import {EditProfilePayload} from "@/domain/user/EditProfilePayload";
import {User} from "@/domain/user/User";

export interface UserService {
    getById(id: string): Promise<User | null>;
    getAll(): Promise<User[]>;

    search(query: string): Promise<User[]>;

    follow(userId: string, targetId: string): Promise<void>;
    unfollow(userId: string, targetId: string): Promise<void>;

    updateProfile(
        id: string,
        data: EditProfilePayload
    ): Promise<User>;

    getFriends(userId: string): Promise<User[]>;
    getIncomingRequests(userId: string): Promise<User[]>;
    getOutgoingRequests(userId: string): Promise<User[]>;

    sendFriendRequest(fromId: string, toId: string): Promise<void>;
    acceptFriendRequest(userId: string, fromId: string): Promise<void>;
    declineFriendRequest(userId: string, fromId: string): Promise<void>;
    removeFriend(userId: string, friendId: string): Promise<void>;
    cancelFriendRequest(fromId: string, toId: string): Promise<void>;
}