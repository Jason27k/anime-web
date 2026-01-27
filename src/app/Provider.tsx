"use client";
import { createContext, useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export enum LanguageType {
  English = "en",
  Romanji = "ro",
  Japanese = "jp",
}

export type CardSize = "small" | "medium" | "large";
export type GridDensity = "compact" | "comfortable" | "spacious";

export interface UserSettings {
  language: LanguageType;
  cardSize: CardSize;
  gridDensity: GridDensity;
  showAiringTime: boolean;
  showEpisodeProgress: boolean;
}

const defaultSettings: UserSettings = {
  language: LanguageType.English,
  cardSize: "medium",
  gridDensity: "comfortable",
  showAiringTime: true,
  showEpisodeProgress: true,
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10,
    },
  },
});

// Legacy context for backwards compatibility
export const LanguageContext = createContext({
  language: LanguageType.English,
  setLanguage: (language: LanguageType) => {},
});

// New settings context
export const SettingsContext = createContext<{
  settings: UserSettings;
  updateSettings: (updates: Partial<UserSettings>) => void;
}>({
  settings: defaultSettings,
  updateSettings: () => {},
});

const SETTINGS_KEY = "animetrove-settings";

export default function Provider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSettings({ ...defaultSettings, ...parsed });
      } catch {
        // Invalid JSON, use defaults
      }
    }
    setIsLoaded(true);
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    }
  }, [settings, isLoaded]);

  const updateSettings = (updates: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  // Legacy setLanguage for backwards compatibility
  const setLanguage = (language: LanguageType) => {
    updateSettings({ language });
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      <LanguageContext.Provider
        value={{
          language: settings.language,
          setLanguage,
        }}
      >
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </LanguageContext.Provider>
    </SettingsContext.Provider>
  );
}
