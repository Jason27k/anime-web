"use client";
import { createContext, useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export type CardSize = "small" | "medium" | "large";
export type GridDensity = "compact" | "comfortable" | "spacious";

export interface UserSettings {
  cardSize: CardSize;
  gridDensity: GridDensity;
  showAiringTime: boolean;
  showEpisodeProgress: boolean;
}

const defaultSettings: UserSettings = {
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

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    }
  }, [settings, isLoaded]);

  const updateSettings = (updates: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </SettingsContext.Provider>
  );
}
