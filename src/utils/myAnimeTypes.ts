export interface AnimeData {
  data: {
    one: {
      media: [Anime];
    };
    two: {
      media: [Anime];
    };
    three: {
      media: [Anime];
    };
    four: {
      media: [Anime];
    };
    five: {
      media: [Anime];
    };
    six: {
      media: [Anime];
    };
  };
}

export interface Anime {
  id: number;
  title: Title;
  coverImage: CoverImage;
  episodes: number;
  streamingEpisodes: StreamingEpisode[];
  nextAiringEpisode: NextAiringEpisode | null;
  season: "WINTER" | "SPRING" | "SUMMER" | "FALL";
  seasonYear: number;
}

interface Title {
  userPreferred: string;
  romaji: string;
  english: string;
  native: string;
}

interface CoverImage {
  extraLarge: string;
}

interface StreamingEpisode {
  title: string;
}

interface NextAiringEpisode {
  id: number;
  airingAt: number;
  episode: number;
}