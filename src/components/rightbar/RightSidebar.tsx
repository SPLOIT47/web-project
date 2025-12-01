import Surface from "@components/ui/Surface";

export default function RightSidebar() {
    return (
        <Surface className="w-64 p-4 h-fit sticky top-20 flex flex-col gap-3">
            <h2 className="text-lg font-semibold neon-text">Recommendations</h2>

            <div className="flex flex-col gap-3">
                <div className="p-3 rounded-lg bg-[var(--bg-main)] hover:shadow-[0_0_10px_var(--primary-glow)] transition">
                    User Recommendation 1
                </div>
                <div className="p-3 rounded-lg bg-[var(--bg-main)] hover:shadow-[0_0_10px_var(--primary-glow)] transition">
                    User Recommendation 2
                </div>
                <div className="p-3 rounded-lg bg-[var(--bg-main)] hover:shadow-[0_0_10px_var(--primary-glow)] transition">
                    User Recommendation 3
                </div>
            </div>
        </Surface>
    );
}