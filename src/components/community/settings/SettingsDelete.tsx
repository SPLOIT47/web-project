import Card from "@components/ui/Card";
import Button from "@components/ui/Button";

export default function SettingsDelete() {
    return (
        <Card className="border-red-500">

            <h2 className="text-xl font-semibold neon-text mb-3">Delete Community</h2>

            <p className="opacity-80 mb-4">
                This action is irreversible. All posts and members will be removed.
            </p>

            <Button className="bg-red-600 hover:bg-red-700">
                Delete community
            </Button>

        </Card>
    );
}