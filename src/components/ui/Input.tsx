import React from "react";

type InputProps = {
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    className?: string;
    type?: string;
};

export default function Input({ value, onChange, placeholder, className = "", type = "text" }: InputProps) {
    return (
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full bg-[var(--bg-surface)] border border-[var(--border-color)] 
                        rounded-lg px-4 py-2 text-[var(--text-main)] 
                        focus:outline-none focus:ring-2 focus:ring-[var(--primary)]
                        shadow-sm focus:shadow-[0_0_10px_var(--primary-glow)]
                        transition-all ${className}`}
        />
    );
}