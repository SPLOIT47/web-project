import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { CSSProperties } from "react";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";

type FAStyle = CSSProperties & Record<string, string | number>;

type IconProps = {
    name: IconProp;
    className?: string;
    style?: FAStyle;
};

export default function Icon({ name, className = "", style }: IconProps) {
    // @ts-ignore
    return <FontAwesomeIcon icon={name} className={className} style={style} />;
}