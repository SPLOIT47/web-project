import React from "react";

type ButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    type?: "button" | "submit";
};

export default function Button({ children, onClick, className = "", type = "button" }: ButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`neon-btn ${className}`}
        >
            {children}
        </button>
    );
}