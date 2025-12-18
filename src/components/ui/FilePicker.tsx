import {useRef, useTransition} from "react";
import Icon from "@components/ui/Icon";
import {useTranslation} from "react-i18next";

type Props = {
    files: File[];
    onChange: (files: File[]) => void;
    multiple?: boolean;
    accept?: string;
};

export default function FilePicker({files, onChange, multiple = true, accept = "image/*",}: Props){
    const inputRef = useRef<HTMLInputElement>(null);
    const { t } = useTranslation();
    const open = () => inputRef.current?.click();

    return (
        <div className="flex flex-col gap-2">
            <button
                type="button"
                onClick={open}
                className="
                    flex items-center gap-2
                    px-3 py-2 w-fit
                    rounded-lg border
                    bg-[var(--bg-surface)]
                    border-[var(--border-color)]
                    neon-text-hover
                    hover:border-[var(--primary)]
                    transition
                    text-sm
                "
            >
                <Icon name="image" />
                {t("post.addPhoto")}
            </button>

            {files.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                    {files.map((file, idx) => {
                        const url = URL.createObjectURL(file);

                        return (
                            <div
                                key={idx}
                                className="
                                    relative w-20 h-20
                                    rounded-lg overflow-hidden
                                    border border-[var(--border-color)]
                                "
                            >
                                <img
                                    src={url}
                                    alt=""
                                    className="w-full h-full object-cover"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        onChange(
                                            files.filter((_, i) => i !== idx)
                                        )
                                    }
                                    className="
                                        absolute top-1 right-1
                                        bg-black/60
                                        rounded-full p-1
                                        text-white text-xs
                                        hover:bg-red-500
                                    "
                                >
                                    <Icon name="times" />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            <input
                ref={inputRef}
                type="file"
                multiple={multiple}
                accept={accept}
                className="hidden"
                onChange={e =>
                    onChange(
                        e.target.files
                            ? [...files, ...Array.from(e.target.files)]
                            : files
                    )
                }
            />
        </div>
    );
}