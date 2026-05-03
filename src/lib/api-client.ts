// Type exports only — HTTP client removed (replaced by Drizzle + direct AniList fetch in actions.ts)

import { Anime } from "@/utils/myAnimeTypes";

export type AnimeStatus = "WATCHING" | "COMPLETED" | "DROPPED";

export type MyListEntry = {
  id: number;
  animeId: number;
  status: AnimeStatus;
  episode: number | null;
  createdAt: string;
  anime?: Anime;
};

export type MyListStats = {
  watching: number;
  completed: number;
  dropped: number;
  total: number;
};
