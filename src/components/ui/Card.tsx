import React from "react";

type CardProps = {
    children: React.ReactNode;
    className?: string;
};

export default function Card({ children, className = "" }: CardProps) {
    return (
        <div className={`neon-surface neon-surface-hover p-4 rounded-xl ${className}`}>
            {children}
        </div>
    );
}