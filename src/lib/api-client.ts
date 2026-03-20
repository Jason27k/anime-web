// Type exports only — HTTP client removed (replaced by Drizzle + direct AniList fetch in actions.ts)

export type AnimeStatus = "WATCHING" | "COMPLETED" | "DROPPED";

export type MyListEntry = {
  id: number;
  animeId: number;
  status: AnimeStatus;
  episode: number | null;
  createdAt: string;
  anime?: unknown; // AniList media object, cast at call site
};

export type MyListStats = {
  watching: number;
  completed: number;
  dropped: number;
  total: number;
};
