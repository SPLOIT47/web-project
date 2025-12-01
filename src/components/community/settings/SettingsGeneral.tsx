import Card from "@components/ui/Card";
import Input from "@components/ui/Input";
import Button from "@components/ui/Button";

export default function SettingsGeneral() {
    return (
        <Card className="flex flex-col gap-4">

            <Input placeholder="Community name" />

            <div className="flex flex-col">
                <label className="opacity-80 mb-1">Category</label>
                <select className="p-3 rounded bg-[var(--bg-surface)] border border-[var(--border-color)]">
                    <option>Technology</option>
                    <option>Design</option>
                    <option>Education</option>
                </select>
            </div>

            <div>
                <label className="opacity-80 mb-1 block">Description</label>
                <textarea
                    className="
                        w-full p-3 h-32 rounded
                        bg-[var(--bg-surface)]
                        border border-[var(--border-color)]
                    "
                />
            </div>

            <Button>Save</Button>

        </Card>
    );
}