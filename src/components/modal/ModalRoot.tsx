import { useModalStore } from "@/store/modalStore";

import CommunityDetailsModal from "@components/modal/community/CommunityDetailsModal";
import CommunityFollowersModal from "@components/modal/community/CommunityFollowersModal";
import ConfirmDeleteCommunityModal from "@components/modal/community/ConfirmDeleteCommunityModal";
import AddPostModal from "@components/modal/post/AddPostModal";
import EditProfileModal from "@components/modal/profile/EditProfileModal";
import CreateChatModal from "@components/modal/chat/CreateChatModal";
import ChatInfoModal from "@components/modal/chat/ChatInfoModal";


export default function ModalRoot() {
    const { modal, close } = useModalStore();

    if (modal.type === null) return null;

    switch (modal.type) {

        case "communityDetails":
            return (
                <CommunityDetailsModal
                    open
                    communityId={modal.communityId}
                    onClose={close}
                />
            );

        case "communityFollowers":
            return (
                <CommunityFollowersModal
                    open
                    userIds={modal.userIds}
                    onClose={close}
                />
            );

        case "confirmDeleteCommunity":
            return (
                <ConfirmDeleteCommunityModal
                    open
                    communityId={modal.communityId}
                    onClose={close}
                />
            );

        case "editProfile":
            return (
                <EditProfileModal
                    open
                    user={modal.user}
                    onClose={close}
                />
            );

        case "addPost":
            return (
                <AddPostModal
                    open
                    onClose={close}
                    author={modal.author}
                />
            );

        case "createChat":
            return <CreateChatModal open onClose={close} />;

        case "chatInfo":
            return (
                <ChatInfoModal
                    open
                    chatId={modal.chatId}
                    onClose={close}
                />
            );

        default:
            return null;
    }
}