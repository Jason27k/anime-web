import { Anime, Genre, JikanClient } from "@tutkli/jikan-ts";
import { fetchDataWithRetry } from "@/utils/limiter";
import { buildMemoryStorage } from "axios-cache-interceptor";
import { get } from "http";
import page from "./liked/page";

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

const getStartDate = (year: string, season: string) => {
  if (season === "spring") {
    return year + "-04-01";
  } else if (season === "summer") {
    return year + "-07-01";
  } else if (season === "fall") {
    return year + "-10-01";
  } else {
    return year + "-01-01";
  }
};

const getSeasonMonth = (season: string) => {
  if (season === "spring") {
    return 4;
  } else if (season === "summer") {
    return 7;
  } else if (season === "fall") {
    return 10;
  } else {
    return 1;
  }
};

const monthToSeason = (month: number) => {
  console.log("In function", month);
  if (month >= 0 && month < 4) {
    return "winter";
  } else if (month >= 4 && month < 7) {
    return "spring";
  } else if (month >= 7 && month < 10) {
    return "summer";
  } else {
    return "fall";
  }
};

export const fetchAnimeSearch = async (
  genres?: string,
  year?: string,
  format?: string,
  text?: string,
  season?: string,
  page?: number
) => {
  const params: { [key: string]: string } = {};
  if (genres) {
    params["genres"] = genres;
  }
  if (year) {
    params["start_date"] = year + "-01-01";
    params["end_date"] = year + "-12-31";
  }
  if (format) {
    params["type"] = format;
  }
  if (text) {
    params["q"] = text;
  }
  params["sfw"] = "true";
  if (season) {
    const date = new Date();
    const currentYear = String(date.getFullYear());
    const month = date.getMonth() + 1;
    console.log(month);
    const queryYear = year ? year : currentYear;
    const currentSeason = monthToSeason(month);
    const start_date = getStartDate(queryYear, season);
    params["start_date"] = start_date;

    if (queryYear === currentYear && season === currentSeason) {
      params["status"] = "airing";
      delete params["end_date"];
    } else if (
      Number(queryYear) > Number(currentYear) ||
      (queryYear === currentYear &&
        getSeasonMonth(season) > getSeasonMonth(currentSeason))
    ) {
      delete params["end_date"];
      params["status"] = "upcoming";
    } else {
      if (season === "spring") {
        params["start_date"] = queryYear + "-04-01";
        params["end_date"] = queryYear + "-06-30";
      } else if (season === "summer") {
        params["start_date"] = queryYear + "-07-01";
        params["end_date"] = queryYear + "-09-30";
      } else if (season === "fall") {
        params["start_date"] = queryYear + "-10-01";
        params["end_date"] = queryYear + "-12-31";
      } else if (season === "winter") {
        params["start_date"] = queryYear + "-01-01";
        params["end_date"] = queryYear + "-03-31";
      }
    }
  }
  if (page) {
    params["page"] = String(page);
  }
  return await fetchDataWithRetry<Anime[]>(() =>
    getJikanClient().anime.getAnimeSearch(params)
  );
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
