import { useEffect } from "react";
import { createPortal } from "react-dom";

type BaseModalProps = {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;

    maxWidth?: string;
    className?: string;
};

export default function BaseModal({
                                      open,
                                      onClose,
                                      children,
                                      maxWidth = "max-w-lg",
                                      className = "",
                                  }: BaseModalProps) {

    useEffect(() => {
        if (!open) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        document.addEventListener("keydown", onKeyDown);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = "";
        };
    }, [open, onClose]);

    if (!open) return null;

    return createPortal(
        <div
            className="
                fixed inset-0 z-[9999]
                bg-black/60
                flex items-center justify-center
            "
            onClick={onClose}
        >
            <div
                onClick={e => e.stopPropagation()}
                className={`
                    w-full ${maxWidth}
                    max-h-[80vh]
                    overflow-y-auto
                    ${className}
                `}
            >
                {children}
            </div>
        </div>,
        document.body
    );
}