"use client";
import { createContext, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export enum LanguageType {
  English = "en",
  Romanji = "ro",
  Japanese = "jp",
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10,
    },
  },
});

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
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </LanguageContext.Provider>
  );
}
