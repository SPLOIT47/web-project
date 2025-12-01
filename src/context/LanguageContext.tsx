import { createContext, useState, ReactNode } from "react";
import i18n from "../i18n";

interface LanguageContextType {
    lang: string;
    switchLang: (lng: string) => void;
}

export const LanguageContext = createContext<LanguageContextType>({
    lang: "ru",
    switchLang: () => {},
});

interface Props {
    children: ReactNode;
}

export default function LanguageProvider({ children }: Props) {
    const [lang, setLang] = useState<string>(i18n.language || "ru");

    const switchLang = (lng: string) => {
        setLang(lng);
        i18n.changeLanguage(lng);
    };

    return (
        <LanguageContext.Provider value={{ lang, switchLang }}>
            {children}
        </LanguageContext.Provider>
    );
}
