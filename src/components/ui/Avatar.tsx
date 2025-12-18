import Icon from "@components/ui/Icon";

type AvatarProps = {
    src?: string | null;
    size?: number;
};

export default function Avatar({ src, size = 48 }: AvatarProps) {
    const imageSrc = src && src.trim() !== "" ? src : undefined;

    return (
        <div
            className="
                relative rounded-full overflow-hidden
                flex items-center justify-center
                bg-[var(--bg-surface)]
            "
            style={{ width: size, height: size }}
        >
            {imageSrc ? (
                <img
                    src={imageSrc}
                    className="w-full h-full object-cover pointer-events-none"
                    alt="avatar"
                />
            ) : (
                <Icon
                    name="user"
                    className="opacity-40"
                    style={{ fontSize: size * 0.5 }}
                />
            )}
        </div>
    );
}