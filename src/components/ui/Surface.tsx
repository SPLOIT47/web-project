import { ReactNode } from "react";

type SurfaceProps = {
    children: ReactNode;
    className?: string;
};

export default function Surface({ children, className = "" }: SurfaceProps) {
    return (
        <div className={`neon-surface ${className}`}>
            {children}
        </div>
    );
}