import { useNavigate } from "react-router-dom";

export default function CommunityCard({ community, type }) {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/community/${community.id}`)}
            className="
                p-4 rounded-xl border border-[var(--border-color)]
                bg-[var(--bg-surface)]
                shadow-[0_0_12px_var(--primary-glow)]
                hover:shadow-[0_0_18px_var(--primary-glow)]
                transition-all flex gap-4 fade-in cursor-pointer
            "
        >
            <img
                src={community.image}
                className="w-20 h-20 rounded-xl object-cover border border-[var(--border-color)]"
            />

            <div className="flex-1 flex flex-col justify-between">

                <div>
                    <h3 className="text-lg font-semibold neon-text">{community.name}</h3>

                    <div className="opacity-70 text-sm mt-1">
                        {community.members} members
                    </div>

                    <div className="opacity-60 text-xs mt-1">
                        {community.description}
                    </div>
                </div>
            </div>
        </div>
    );
}