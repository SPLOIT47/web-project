import { useRef, useState } from "react";
import Avatar from "@components/ui/Avatar";
import Icon from "@components/ui/Icon";
import { ServiceLocator } from "@/application/ServiceLocator";

type AvatarUploaderProps = {
    value?: string | null;
    size?: number;
    disabled?: boolean;
    onChange: (url: string | null) => void;
};

export default function AvatarUploader({
                                           value,
                                           size = 96,
                                           disabled = false,
                                           onChange,
                                       }: AvatarUploaderProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [menuOpen, setMenuOpen] = useState(false);

    const openFilePicker = () => {
        if (disabled) return;
        setMenuOpen(false);
        inputRef.current?.click();
    };

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (disabled) return;

        const file = e.target.files?.[0];
        if (!file) return;

        const uploaded = await ServiceLocator.fileService.upload(file);
        onChange(uploaded.url);

        e.target.value = "";
    };

    const handleRemove = () => {
        if (disabled) return;
        onChange(null);
        setMenuOpen(false);
    };

    return (
        <div className="relative w-fit">
            <div
                className={`
                    relative group
                    ${disabled ? "cursor-default opacity-70" : "cursor-pointer"}
                `}
                onClick={() => {
                    if (!disabled) setMenuOpen(true);
                }}
            >
                <Avatar src={value} size={size} />

                {!disabled && (
                    <div
                        className="
                            absolute inset-0 rounded-full
                            bg-black/45
                            flex items-center justify-center
                            opacity-0 group-hover:opacity-100
                            transition
                        "
                    >
                        <span className="text-white text-sm font-medium neon-text">
                            Изменить
                        </span>
                    </div>
                )}
            </div>

            {!disabled && menuOpen && (
                <div
                    className="
                        absolute left-1/2 top-full mt-3
                        -translate-x-1/2
                        bg-[var(--bg-surface)]
                        border border-[var(--border-color)]
                        rounded-xl
                        shadow-lg
                        z-50
                        w-44
                        fade-in
                    "
                >
                    <button
                        className="w-full px-4 py-2 flex gap-2 items-center hover:bg-black/5"
                        onClick={openFilePicker}
                    >
                        <Icon name="upload" />
                        Загрузить
                    </button>

                    {value && (
                        <button
                            className="w-full px-4 py-2 flex gap-2 items-center text-red-500 hover:bg-red-500/10"
                            onClick={handleRemove}
                        >
                            <Icon name="trash" />
                            Удалить
                        </button>
                    )}

                    <button
                        className="w-full px-4 py-2 flex gap-2 items-center opacity-70 hover:bg-black/5"
                        onClick={() => setMenuOpen(false)}
                    >
                        <Icon name="times" />
                        Отмена
                    </button>
                </div>
            )}

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFile}
            />
        </div>
    );
}