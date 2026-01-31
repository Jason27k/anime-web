const API_BASE_URL = process.env.ANIME_API_URL || "http://localhost:8080";

export type AnimeStatus = "WATCHING" | "COMPLETED" | "DROPPED";

export type SavedAnimeResponse = {
  userId: string;
  animeId: number;
  status: AnimeStatus;
  episode: number | null;
  createdAt: string;
  updatedAt: string;
};

export type PageResponse<T> = {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
};

export type AnimeStatsResponse = {
  watching: number;
  completed: number;
  dropped: number;
  total: number;
};

export type UpdateAnimeRequest = {
  episode?: number | null;
  status?: AnimeStatus;
};

class AnimeApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  async getSavedAnime(
    userId: string,
    options: {
      status?: AnimeStatus;
      page?: number;
      size?: number;
      sortBy?: "updatedAt" | "createdAt" | "episode" | "status";
      sortDirection?: "asc" | "desc";
    } = {}
  ): Promise<PageResponse<SavedAnimeResponse>> {
    const params = new URLSearchParams();
    if (options.status) params.append("status", options.status);
    if (options.page !== undefined)
      params.append("page", options.page.toString());
    if (options.size !== undefined)
      params.append("size", options.size.toString());
    if (options.sortBy) params.append("sortBy", options.sortBy);
    if (options.sortDirection)
      params.append("sortDirection", options.sortDirection);

    const queryString = params.toString();
    const endpoint = `/api/users/${userId}/saved-anime${queryString ? `?${queryString}` : ""}`;

    return this.request<PageResponse<SavedAnimeResponse>>(endpoint);
  }

  async getAllUserAnime(userId: string): Promise<SavedAnimeResponse[]> {
    return this.request<SavedAnimeResponse[]>(
      `/api/users/${userId}/saved-anime/all`
    );
  }

  async getUserAnime(
    userId: string,
    animeId: number
  ): Promise<SavedAnimeResponse> {
    return this.request<SavedAnimeResponse>(
      `/api/users/${userId}/anime/${animeId}`
    );
  }

  async hasUserSavedAnime(userId: string, animeId: number): Promise<boolean> {
    return this.request<boolean>(
      `/api/users/${userId}/anime/${animeId}/saved`
    );
  }

  async countUserAnime(userId: string, status?: AnimeStatus): Promise<number> {
    const params = status ? `?status=${status}` : "";
    return this.request<number>(
      `/api/users/${userId}/saved-anime/count${params}`
    );
  }

  async addAnimeToList(
    userId: string,
    animeId: number
  ): Promise<SavedAnimeResponse> {
    return this.request<SavedAnimeResponse>(
      `/api/users/${userId}/anime/${animeId}`,
      { method: "POST" }
    );
  }

  async removeAnimeFromList(userId: string, animeId: number): Promise<void> {
    return this.request<void>(`/api/users/${userId}/anime/${animeId}`, {
      method: "DELETE",
    });
  }

  async updateAnimeProgress(
    userId: string,
    animeId: number,
    update: UpdateAnimeRequest
  ): Promise<SavedAnimeResponse> {
    return this.request<SavedAnimeResponse>(
      `/api/users/${userId}/anime/${animeId}`,
      {
        method: "PATCH",
        body: JSON.stringify(update),
      }
    );
  }

  async getUserAnimeStats(userId: string): Promise<AnimeStatsResponse> {
    return this.request<AnimeStatsResponse>(
      `/api/users/${userId}/saved-anime/stats`
    );
  }
}

export const animeApi = new AnimeApiClient();

// Types for new optimized endpoints
export type ScheduleEntry = {
  id: number;
  episode: number;
  airingAt: number;
  media: {
    id: number;
    idMal: number;
    title: {
      romaji: string;
      native: string;
      english: string;
    };
    coverImage: {
      extraLarge: string;
      color?: string;
    };
    bannerImage?: string;
    format: string;
    popularity: number;
    isAdult: boolean;
  };
};

export type WatchlistScheduleResponse = {
  schedules: ScheduleEntry[];
  totalCount: number;
};

export type HomepageDataResponse = {
  trending: MediaSummary[];
  popular: MediaSummary[];
  top: MediaSummary[];
  upcoming: MediaSummary[];
  todaySchedule: ScheduleEntry[];
  currentSeason: "WINTER" | "SPRING" | "SUMMER" | "FALL";
  currentSeasonYear: number;
  nextSeason: "WINTER" | "SPRING" | "SUMMER" | "FALL";
  nextSeasonYear: number;
  cachedAt: string;
};

export type MediaSummary = {
  id: number;
  idMal: number;
  title: {
    romaji: string;
    native: string;
    english: string;
  };
  coverImage: {
    extraLarge: string;
    color?: string;
  };
  bannerImage?: string;
  format: string;
  status: string;
  season: string;
  seasonYear: number;
  episodes?: number;
  averageScore?: number;
  popularity: number;
  genres: string[];
  nextAiringEpisode?: {
    airingAt: number;
    timeUntilAiring: number;
    episode: number;
  };
};

class OptimizedApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get user's watchlist schedule for a date range.
   * Backend queries AniList with only the user's saved anime IDs.
   */
  async getWatchlistSchedule(
    userId: string,
    startDate: number,
    endDate: number
  ): Promise<WatchlistScheduleResponse> {
    const params = new URLSearchParams({
      startDate: startDate.toString(),
      endDate: endDate.toString(),
    });
    return this.request<WatchlistScheduleResponse>(
      `/api/users/${userId}/watchlist-schedule?${params}`
    );
  }

  /**
   * Get cached homepage data (trending, popular, top, upcoming, today's schedule).
   * Backend caches this data and refreshes every 15-30 minutes.
   */
  async getHomepageData(): Promise<HomepageDataResponse> {
    return this.request<HomepageDataResponse>("/api/homepage");
  }

  /**
   * Get today's airing schedule (cached).
   * Backend caches and refreshes every 5-10 minutes.
   */
  async getTodaySchedule(): Promise<ScheduleEntry[]> {
    return this.request<ScheduleEntry[]>("/api/schedule/today");
  }
}

export const optimizedApi = new OptimizedApiClient();
