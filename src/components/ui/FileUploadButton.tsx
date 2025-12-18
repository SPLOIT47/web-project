import { useRef } from "react";
import { useTranslation } from "react-i18next";
import Button from "@components/ui/Button";
import Icon from "@components/ui/Icon";

export function FileUploadButton({
                                     label,
                                     accept,
                                     multiple = false,
                                     onSelect,
                                 }: {
    label?: string;
    accept?: string;
    multiple?: boolean;
    onSelect: (files: File[]) => void;
}) {
    const { t } = useTranslation();
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div>
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                multiple={multiple}
                className="hidden"
                onChange={e => {
                    if (!e.target.files) return;
                    onSelect(Array.from(e.target.files));
                    e.target.value = "";
                }}
            />

            <button
                type="button"
                className="upload-btn neon-text"
                onClick={() => inputRef.current?.click()}
            >
                <Icon name="upload" />
                {label ?? t("fileUpload.uploadImage")}
            </button>
        </div>
    );
}