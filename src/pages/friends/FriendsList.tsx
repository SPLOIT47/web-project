import FriendCard from "./FriendCard";

export default function FriendsList({ tab }: { tab: string }) {
    const mockFriends = [
        {
            id: 1,
            name: "Anna Petrova",
            online: true,
            avatar: "https://picsum.photos/200?1",
        },
        {
            id: 2,
            name: "Ivan Sidorov",
            online: false,
            avatar: "https://picsum.photos/200?2",
        },
    ];

    const mockRequests = [
        {
            id: 3,
            name: "Maria Volkova",
            avatar: "https://picsum.photos/200?3",
        },
    ];

    const mockOutgoing = [
        {
            id: 4,
            name: "Dmitry Ivanov",
            avatar: "https://picsum.photos/200?4",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-2 fade-in">

            {tab === "friends" &&
                mockFriends.map((f) => (
                    <FriendCard key={f.id} user={f} type="friend" />
                ))}

            {tab === "requests" &&
                mockRequests.map((f) => (
                    <FriendCard key={f.id} user={f} type="request" />
                ))}

            {tab === "outgoing" &&
                mockOutgoing.map((f) => (
                    <FriendCard key={f.id} user={f} type="outgoing" />
                ))}

            {tab === "search" && (
                <div className="text-center opacity-70 mt-6">
                    Search will be implemented later 🔍
                </div>
            )}
        </div>
    );
}