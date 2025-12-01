import Card from "@components/ui/Card";
import Input from "@components/ui/Input";
import Button from "@components/ui/Button";
import Icon from "@components/ui/Icon";
import { useNavigate } from "react-router-dom";

export default function CreateCommunityPage() {
    const navigate = useNavigate();

    return (
        <div className="h-[calc(100vh-80px)] overflow-y-auto p-6 text-[var(--text-main)] fade-in">
            <div className="max-w-3xl mx-auto">

                <h1 className="text-3xl font-bold neon-text mb-6">
                    Create Community
                </h1>

                <Card className="flex flex-col gap-4">

                    <Input placeholder="Community name" />

                    <div className="flex flex-col">
                        <label className="opacity-80 mb-1">Type</label>
                        <select className="p-3 rounded bg-[var(--bg-surface)] border border-[var(--border-color)]">
                            <option>Public Page</option>
                            <option>Group</option>
                            <option>Event</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="opacity-80 mb-1">Category</label>
                        <select className="p-3 rounded bg-[var(--bg-surface)] border border-[var(--border-color)]">
                            <option>Technology</option>
                            <option>Design</option>
                            <option>Education</option>
                            <option>Science</option>
                            <option>Entertainment</option>
                            <option>Sports</option>
                        </select>
                    </div>

                    <div>
                        <label className="opacity-80 mb-1 block">Description</label>
                        <textarea
                            placeholder="Write something about your community..."
                            className="
                                w-full p-3 h-32 rounded
                                bg-[var(--bg-surface)]
                                border border-[var(--border-color)]
                            "
                        />
                    </div>

                    <div>
                        <label className="opacity-80 mb-1 block">Avatar</label>
                        <div className="flex items-center gap-3">
                            <div className="w-20 h-20 rounded-xl bg-gray-600/20"></div>
                            <Button className="flex gap-2 items-center">
                                <Icon name="upload" />
                                Upload
                            </Button>
                        </div>
                    </div>

                    <div>
                        <label className="opacity-80 mb-1 block">Cover</label>
                        <div className="w-full h-32 rounded-xl bg-gray-600/20 mb-2"></div>
                        <Button className="flex gap-2 items-center">
                            <Icon name="upload" />
                            Upload cover
                        </Button>
                    </div>

                    <Button
                        className="mt-4"
                        onClick={() => navigate("/community/123/settings")}
                    >
                        Create Community
                    </Button>

                </Card>
            </div>
        </div>
    );
}