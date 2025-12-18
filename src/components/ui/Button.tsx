import React from "react";

type ButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    type?: "button" | "submit";
    disabled?: boolean;
};

export default function Button({
                                   children,
                                   onClick,
                                   className = "",
                                   type = "button",
                                   disabled = false,
                               }: ButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`neon-btn ${className} ${
                disabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
            {children}
        </button>
    );
}