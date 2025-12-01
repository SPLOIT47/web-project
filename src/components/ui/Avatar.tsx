type AvatarProps = {
    src: string;
    size?: number;
};

export default function Avatar({ src, size = 40 }: AvatarProps) {
    return (
        <img
            src={src}
            alt="avatar"
            style={{ width: size, height: size }}
            className="rounded-full border border-[var(--border-color)] shadow-[0_0_6px_var(--primary-glow)]"
        />
    );
}