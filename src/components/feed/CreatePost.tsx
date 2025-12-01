import Card from "@components/ui/Card";
import Input from "@components/ui/Input";
import Button from "@components/ui/Button";
import Avatar from "@components/ui/Avatar";

export default function CreatePost() {
    return (
        <Card className="flex gap-4 items-start">
            <Avatar src="https://picsum.photos/200" size={48} />

            <div className="flex-1 flex flex-col gap-3">
                <Input placeholder="What's on your mind?" />

                <div className="flex justify-end">
                    <Button>Post</Button>
                </div>
            </div>
        </Card>
    );
}