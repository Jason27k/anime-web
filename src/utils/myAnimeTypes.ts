import { AnimeStatus } from "@/lib/api-client";
import { MediaSeason } from "@/utils/anilistTypes";

export type AnimeInfo = {
  id: number;
  status: AnimeStatus;
  episode: number | null;
  anime: Anime;
};

export interface AnimeData {
  data: {
    Page: {
      media: Anime[];
    };
  };
}

export interface Anime {
  id: number;
  title: Title;
  coverImage: CoverImage;
  episodes: number;
  streamingEpisodes?: StreamingEpisode[];
  nextAiringEpisode?: NextAiringEpisode | null;
  season: MediaSeason;
  seasonYear: number;
}

export interface Title {
  userPreferred: string;
  romaji: string;
  english: string;
  native: string;
}

export interface CoverImage {
  extraLarge: string;
}

export interface StreamingEpisode {
  title: string;
}

export interface NextAiringEpisode {
  id: number;
  airingAt: number;
  episode: number;
}
