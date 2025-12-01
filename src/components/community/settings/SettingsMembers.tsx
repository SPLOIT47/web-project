import Card from "@components/ui/Card";
import Button from "@components/ui/Button";

const demoMembers = [
    { id: 1, name: "John Doe", role: "admin" },
    { id: 2, name: "Sarah Connor", role: "member" },
    { id: 3, name: "Tim Cook", role: "moderator" },
];

export default function SettingsMembers() {
    return (
        <Card className="flex flex-col gap-4">

            {demoMembers.map(m => (
                <div key={m.id} className="flex items-center justify-between">
                    <div>
                        <div className="font-semibold">{m.name}</div>
                        <div className="text-sm opacity-70">{m.role}</div>
                    </div>

                    <select className="p-2 bg-[var(--bg-surface)] border rounded">
                        <option>Admin</option>
                        <option>Moderator</option>
                        <option>Editor</option>
                        <option>Member</option>
                    </select>
                </div>
            ))}

        </Card>
    );
}