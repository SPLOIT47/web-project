import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Icon({ name, className = "" }: { name: any; className?: string }) {
    return <FontAwesomeIcon icon={name} className={className} />;
}