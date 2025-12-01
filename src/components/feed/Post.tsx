import Card from "@components/ui/Card";
import Avatar from "@components/ui/Avatar";
import Icon from "@components/ui/Icon";

export default function Post() {
    return (
        <Card className="flex flex-col gap-3 p-4 fade-in">

            <div className="flex gap-4 items-center">
                <Avatar src="https://picsum.photos/200" size={46} />

                <div>
                    <div className="font-bold neon-text-hover text-lg">
                        John Doe
                    </div>
                    <div className="text-xs opacity-60">2 hours ago</div>
                </div>
            </div>

            <p className="text-[var(--text-main)]">
                Test post
            </p>

            <img
                src="https://picsum.photos/600/300"
                alt="post"
                className="rounded-lg border border-[var(--border-color)] shadow-[0_0_10px_var(--primary-glow)]"
            />

            <div className="flex gap-6 pt-2 text-lg">

                <button className="neon-text-hover transition-all hover:scale-110">
                    <Icon name="heart" />
                </button>

                <button className="neon-text-hover transition-all hover:scale-110">
                    <Icon name="comment" />
                </button>

                <button className="neon-text-hover transition-all hover:scale-110">
                    <Icon name="share" />
                </button>

            </div>
        </Card>
    );
}