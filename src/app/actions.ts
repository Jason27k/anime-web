import { Anime, Genre, JikanClient } from "@tutkli/jikan-ts";
import { fetchDataWithRetry } from "@/utils/limiter";
import { buildMemoryStorage } from "axios-cache-interceptor";

const jikanClient: JikanClient | null = null;

const genres: Genre[] = [];

export const getJikanClient = () => {
  if (!jikanClient) {
    return new JikanClient({
      cacheOptions: {
        storage: buildMemoryStorage(),
        ttl: 1000 * 60 * 10,
        cachePredicate: {
          statusCheck: (status) => status === 200 || status === 203,
        },
        staleIfError: true,
      },
    });
  }
  return jikanClient;
};

export const fetchGenres = async (): Promise<Genre[]> => {
  if (genres.length > 0) {
    return genres;
  }

  var response = await fetchDataWithRetry<Genre[]>(() =>
    getJikanClient().genres.getAnimeGenres("genres")
  );
  if (response === undefined) {
    return genres;
  }
  genres.push(...response.data);
  return genres;
};

export const fetchSchedule = async (page: number) => {
  return await fetchDataWithRetry<Anime[]>(() =>
    getJikanClient().schedules.getSchedules({
      kids: false,
      sfw: true,
      unapproved: false,
      page: page,
    })
  );
};

export const fetchAnime = async (id: number) => {
  return await fetchDataWithRetry<Anime>(() =>
    getJikanClient().anime.getAnimeById(id)
  );
};

export const fetchTopAnime = async (
  page: number,
  type: "TV" | "Ova" | "Movie" | "Special",
  filter: "airing" | "bypopularity" | "favorite" | "upcoming"
) => {
  return await fetchDataWithRetry<Anime[]>(() =>
    getJikanClient().top.getTopAnime({
      limit: 10,
      page: page,
      type: type,
      filter: filter,
    })
  );
};

export const fetchSeasonalAnime = async (
  year: number,
  season: "winter" | "spring" | "summer" | "fall"
) => {
  return await fetchDataWithRetry<Anime[]>(() =>
    getJikanClient().seasons.getSeason(year, season)
  );
};

export const fetchCurrentSeason = async () => {
  return await fetchDataWithRetry<Anime[]>(() =>
    getJikanClient().seasons.getSeasonNow()
  );
};

export const fetchUpcomingSeason = async () => {
  return await fetchDataWithRetry<Anime[]>(() =>
    getJikanClient().seasons.getSeasonUpcoming()
  );
};
