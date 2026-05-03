// ---- Shared union types ----

export type MediaFormat = "TV" | "MOVIE" | "SPECIAL" | "OVA" | "ONA" | "MUSIC";
export type MediaType = "ANIME" | "MANGA";
export type ReleaseStatus = "FINISHED" | "RELEASING" | "NOT_YET_RELEASED" | "CANCELLED";
export type MediaSeason = "WINTER" | "SPRING" | "SUMMER" | "FALL";

// ---- Generic AniList page response ----

export type AniListPageResponse<T> = {
  data: { Page: T };
};

// ---- Shared sub-types ----

// Exported so card components and other consumers can reference it directly
export type MediaTitle = {
  romaji: string;
  english: string;
  native: string;
};

// Unified: was AiringEpisodeType in Media and AiringEpisode in MediaDisplay — same shape
export type AiringEpisode = {
  airingAt: number;
  timeUntilAiring: number;
  episode: number;
};

// ---- MediaCore: fields shared identically by both Media and MediaDisplay ----

export type MediaCore = {
  id: number;
  title: MediaTitle;
  format: MediaFormat;
  type: MediaType;
  status: ReleaseStatus;
  genres: string[];
  isAdult: boolean;
  popularity: number;
  averageScore?: number;
};

// ---- AnimeCardData: minimal type for card components (ISP) ----
// Only the fields cards actually render. Both MediaDisplay and Anime from myAnimeTypes
// satisfy this shape structurally — no cast needed at call sites.

export type AnimeCardData = {
  id: number;
  title: MediaTitle;
  coverImage: { extraLarge: string };
  episodes?: number | null;
  nextAiringEpisode?: { airingAt: number; episode: number } | null;
  averageScore?: number | null;
  popularity?: number;
  studios?: { nodes: { name: string }[] };
};

// ---- Media detail (anime/[id] page) ----

export type MediaResponse = {
  data: { Media: Media };
};

export type Media = MediaCore & {
  coverImage: { extraLarge: string; large: string };
  bannerImage?: string;
  startDate: DateType;
  endDate?: DateType;
  description?: string;
  season?: MediaSeason;
  seasonYear?: number;
  episodes?: number;
  duration?: number;
  chapters?: number;
  volumes?: number;
  synonyms: string[];
  source: "ORIGINAL" | "MANGA" | "LIGHT_NOVEL" | "VISUAL_NOVEL";
  isLocked: boolean;
  meanScore?: number;
  favourites: number;
  isFavouriteBlocked: boolean;
  hashtag?: string;
  countryOfOrigin: string;
  isLicensed: boolean;
  isFavourite: boolean;
  isRecommendationBlocked: boolean;
  isReviewBlocked: boolean;
  nextAiringEpisode?: AiringEpisode;
  relations: { edges: RelationEdge[] };
  characterPreview?: { edges: CharacterEdge[] };
  staffPreview?: { edges: StaffEdge[] };
  studios: { edges: StudioEdge[] };
  reviewPreview?: { pageInfo: { total: number }; nodes: ReviewNode[] };
  recommendations: { pageInfo: { total: number }; nodes: RecommendationNode[] };
  externalLinks: ExternalLink[];
  streamingEpisodes: StreamingEpisode[];
  trailer?: { id: string; site: string };
  rankings: Ranking[];
  tags: Tag[];
  mediaListEntry?: unknown;
  stats?: Stats;
};

// ---- Supporting types for Media ----

type DateType = {
  year: number;
  month?: number;
  day?: number;
};

type RelationEdge = {
  id: number;
  relationType: string;
  node: {
    id: number;
    idMal: number;
    title: MediaTitle;
    format: MediaFormat;
    type: MediaType;
    status: ReleaseStatus;
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
  node: { id: number; name: string };
};

type ReviewNode = {
  id: number;
  summary: string;
  rating: number;
  ratingAmount: number;
  user: { id: number; name: string; avatar: { large: string } };
};

type RecommendationNode = {
  id: number;
  rating: number;
  userRating: "NO_RATING";
  mediaRecommendation: {
    id: number;
    idMal: number;
    title: MediaTitle;
    format: MediaFormat;
    type: MediaType;
    status: ReleaseStatus;
    bannerImage?: string;
    coverImage: { large: string };
  };
  user: { id: number; name: string; avatar: { large: string } };
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
  format: MediaFormat;
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
  scoreDistribution: { score: number; amount: number }[];
};

// ---- Browse / search types ----

export type MediaDisplay = MediaCore & {
  idMal: number;
  coverImage: { extraLarge: string; color?: string | null };
  bannerImage: string;
  startDate: DateTypeDisplay;
  endDate: DateTypeDisplay;
  description: string;
  season: MediaSeason;
  seasonYear: number;
  episodes: number;
  duration: number;
  nextAiringEpisode?: AiringEpisode;
  rankings: RankingDisplay[];
  studios: { nodes: Studio[] };
};

type DateTypeDisplay = {
  year: number;
  month: number;
  day: number;
};

type RankingDisplay = {
  rank: number;
  type: "RATED" | "POPULAR";
  season: MediaSeason | null;
  allTime: boolean;
};

type Studio = {
  id: number;
  name: string;
  siteUrl: string;
};

// ---- Calendar / schedule types ----

export type PageInfo = {
  hasNextPage: boolean;
  total: number;
};

export type AiringSchedule = {
  id: number;
  episode: number;
  airingAt: number;
  media: MediaDisplay;
};

export type CalendarQueryResponse = AniListPageResponse<{
  pageInfo: PageInfo;
  airingSchedules: AiringSchedule[];
}>;

// ---- Search types ----

type PageInfoSearch = {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  hasNextPage: boolean;
};

type SearchPage = {
  pageInfo: PageInfoSearch;
  media: MediaDisplay[];
};

export type SearchQueryResponse = AniListPageResponse<SearchPage>;
