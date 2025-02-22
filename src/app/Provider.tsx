"use client";
import { createContext, useState } from "react";

export enum LanguageType {
  English = "en",
  Romanji = "ro",
  Japanese = "jp",
}

export const LanguageContext = createContext({
  language: LanguageType.English,
  setLanguage: (language: LanguageType) => {},
});

export default function Provider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<LanguageType>(LanguageType.English);
  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}
