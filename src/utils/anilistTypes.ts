export type MediaResponse = {
  data: {
    Media: Media;
  };
};

export type Media = {
  id: number;
  title: {
    userPreferred: string;
    romaji: string;
    english: string;
    native: string;
  };
  coverImage: {
    extraLarge: string;
    large: string;
  };
  bannerImage?: string;
  startDate: DateType;
  endDate?: DateType;
  description?: string;
  season?: "SPRING" | "SUMMER" | "FALL" | "WINTER";
  seasonYear?: number;
  type: "ANIME" | "MANGA";
  format: "TV" | "MOVIE" | "SPECIAL" | "OVA" | "ONA" | "MUSIC";
  status: "FINISHED" | "RELEASING" | "NOT_YET_RELEASED" | "CANCELLED";
  episodes?: number;
  duration?: number;
  chapters?: number;
  volumes?: number;
  genres: string[];
  synonyms: string[];
  source: "ORIGINAL" | "MANGA" | "LIGHT_NOVEL" | "VISUAL_NOVEL";
  isAdult: boolean;
  isLocked: boolean;
  meanScore?: number;
  averageScore?: number;
  popularity: number;
  favourites: number;
  isFavouriteBlocked: boolean;
  hashtag?: string;
  countryOfOrigin: string;
  isLicensed: boolean;
  isFavourite: boolean;
  isRecommendationBlocked: boolean;
  isReviewBlocked: boolean;
  nextAiringEpisode?: AiringEpisodeType;
  relations: {
    edges: RelationEdge[];
  };
  characterPreview?: {
    edges: CharacterEdge[];
  };
  staffPreview?: {
    edges: StaffEdge[];
  };
  studios: {
    edges: StudioEdge[];
  };
  reviewPreview?: {
    pageInfo: { total: number };
    nodes: ReviewNode[];
  };
  recommendations: {
    pageInfo: { total: number };
    nodes: RecommendationNode[];
  };
  externalLinks: ExternalLink[];
  streamingEpisodes: StreamingEpisode[];
  trailer?: {
    id: string;
    site: string;
  };
  rankings: Ranking[];
  tags: Tag[];
  mediaListEntry?: unknown; // Adjust this type based on data structure
  stats?: Stats;
};

// Supporting Types
type DateType = {
  year: number;
  month?: number;
  day?: number;
};

type AiringEpisodeType = {
  airingAt: number;
  timeUntilAiring: number;
  episode: number;
};

type RelationEdge = {
  id: number;
  relationType: string;
  node: {
    id: number;
    idMal: number;
    title: { userPreferred: string };
    format: "TV" | "MOVIE" | "SPECIAL" | "OVA" | "ONA" | "MUSIC";
    type: "ANIME" | "MANGA";
    status: "FINISHED" | "RELEASING" | "NOT_YET_RELEASED" | "CANCELLED";
    bannerImage?: string;
    coverImage: { large: string };
  };
};

type CharacterEdge = {
  id: number;
  role: "MAIN" | "SUPPORTING";
  name?: string;
  voiceActors: VoiceActor[];
  node: {
    id: number;
    name: { userPreferred: string };
    image: { large: string };
  };
};

type VoiceActor = {
  id: number;
  name: { userPreferred: string };
  language: string;
  image: { large: string };
};

type StaffEdge = {
  id: number;
  role: string;
  node: {
    id: number;
    name: { userPreferred: string };
    language: string;
    image: { large: string };
  };
};

type StudioEdge = {
  isMain: boolean;
  node: {
    id: number;
    name: string;
  };
};

type ReviewNode = {
  id: number;
  summary: string;
  rating: number;
  ratingAmount: number;
  user: {
    id: number;
    name: string;
    avatar: { large: string };
  };
};

type RecommendationNode = {
  id: number;
  rating: number;
  userRating: "NO_RATING";
  mediaRecommendation: {
    id: number;
    idMal: number;
    title: { userPreferred: string };
    format: "TV" | "MOVIE" | "SPECIAL" | "OVA" | "ONA" | "MUSIC";
    type: "ANIME" | "MANGA";
    status: "FINISHED" | "RELEASING" | "NOT_YET_RELEASED" | "CANCELLED";
    bannerImage?: string;
    coverImage: { large: string };
  };
  user: {
    id: number;
    name: string;
    avatar: { large: string };
  };
};

type ExternalLink = {
  id: number;
  site: string;
  url: string;
  type: "STREAMING" | "SOCIAL" | "INFO";
  language?: string;
  color?: string;
  icon?: string;
  notes?: string;
  isDisabled: boolean;
};

type StreamingEpisode = {
  site: string;
  title: string;
  thumbnail: string;
  url: string;
};

type Ranking = {
  id: number;
  rank: number;
  type: "RATED" | "POPULAR";
  format: "TV" | "MOVIE" | "SPECIAL" | "OVA" | "ONA" | "MUSIC";
  year?: number;
  season?: string;
  allTime: boolean;
  context: string;
};

type Tag = {
  id: number;
  name: string;
  description: string;
  rank: number;
  isMediaSpoiler: boolean;
  isGeneralSpoiler: boolean;
  userId?: number;
};

type Stats = {
  statusDistribution: {
    status: "CURRENT" | "PLANNING" | "COMPLETED" | "DROPPED" | "PAUSED";
    amount: number;
  }[];
  scoreDistribution: {
    score: number;
    amount: number;
  }[];
};