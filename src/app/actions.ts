"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { myAnimes } from "@/lib/schema";
import { cacheGet, cacheSet, cacheDel, TTL } from "@/lib/cache";
import { eq, desc, and, sql } from "drizzle-orm";
import {
  CalendarQueryResponse,
  SearchQueryResponse,
  AiringSchedule,
  MediaResponse,
} from "@/utils/anilistTypes";
import { Anime } from "@/utils/myAnimeTypes";
import { getTodayRange, getWeekRangeFromToday } from "@/utils/date";
import { AnimeStatus, MyListEntry, MyListStats } from "@/lib/api-client";

// ---- types ----

export type SearchQueryVariables = {
  page?: number;
  id?: number;
  isAdult?: boolean;
  search?: string;
  status?: string;
  season?: "WINTER" | "SPRING" | "SUMMER" | "FALL";
  seasonYear?: number;
  year?: string;
  genres?: string[];
  sort?: string[];
};

// ---- AniList GraphQL helper ----

const ANILIST_URL = "https://graphql.anilist.co";

async function anilistFetch<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const res = await fetch(ANILIST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`AniList request failed: ${res.status}`);
  return res.json();
}

// ---- GraphQL queries ----

const ANIME_BY_ID_QUERY = `
query media($id: Int) {
  Media(id: $id, type: ANIME) {
    id idMal
    title { romaji english native }
    coverImage { extraLarge large }
    bannerImage
    startDate { year month day }
    endDate { year month day }
    description(asHtml: true)
    season seasonYear type format status(version: 2)
    episodes duration chapters volumes genres synonyms
    source(version: 3)
    isAdult isLocked meanScore averageScore popularity favourites
    isFavouriteBlocked hashtag countryOfOrigin isLicensed isFavourite
    isRecommendationBlocked isReviewBlocked
    nextAiringEpisode { airingAt timeUntilAiring episode }
    relations {
      edges {
        id relationType(version: 2)
        node {
          id idMal
          title { english native romaji }
          format type status(version: 2) bannerImage
          coverImage { large }
        }
      }
    }
    characterPreview: characters(perPage: 6, sort: [ROLE, RELEVANCE, ID]) {
      edges {
        id role name
        voiceActors(language: JAPANESE, sort: [RELEVANCE, ID]) {
          id name { userPreferred } language: languageV2 image { large }
        }
        node { id name { userPreferred } image { large } }
      }
    }
    staffPreview: staff(perPage: 8, sort: [RELEVANCE, ID]) {
      edges {
        id role
        node { id name { userPreferred } language: languageV2 image { large } }
      }
    }
    studios { edges { isMain node { id name } } }
    reviewPreview: reviews(perPage: 2, sort: [RATING_DESC, ID]) {
      pageInfo { total }
      nodes {
        id summary rating ratingAmount
        user { id name avatar { large } }
      }
    }
    recommendations(perPage: 10, sort: [RATING_DESC, ID]) {
      pageInfo { total }
      nodes {
        id rating userRating
        mediaRecommendation {
          id idMal title { romaji english native }
          format type status(version: 2) bannerImage coverImage { large }
        }
        user { id name avatar { large } }
      }
    }
    externalLinks { id site url type language color icon notes isDisabled }
    streamingEpisodes { site title thumbnail url }
    trailer { id site }
    rankings { id rank type format year season allTime context }
    tags { id name description rank isMediaSpoiler isGeneralSpoiler userId }
    mediaListEntry { id status score }
    stats {
      statusDistribution { status amount }
      scoreDistribution { score amount }
    }
  }
}`;

const SCHEDULE_QUERY = `
query ($weekStart: Int, $weekEnd: Int, $page: Int) {
  Page(page: $page) {
    pageInfo { hasNextPage total }
    airingSchedules(airingAt_greater: $weekStart, airingAt_lesser: $weekEnd) {
      id episode airingAt
      media {
        id idMal
        title { romaji native english }
        startDate { year month day }
        endDate { year month day }
        status season seasonYear format genres duration popularity episodes type
        averageScore description(asHtml: true) isAdult bannerImage
        nextAiringEpisode { airingAt timeUntilAiring episode }
        coverImage { extraLarge color }
        rankings { rank type season allTime }
        studios(isMain: true) { nodes { id name siteUrl } }
      }
    }
  }
}`;

const SEARCH_QUERY = `
query ($page: Int = 1, $id: Int, $isAdult: Boolean = false, $search: String, $status: MediaStatus, $season: MediaSeason, $seasonYear: Int, $year: String, $genres: [String], $sort: [MediaSort] = [POPULARITY_DESC, SCORE_DESC]) {
  Page(page: $page, perPage: 20) {
    pageInfo { total perPage currentPage lastPage hasNextPage }
    media(id: $id, type: ANIME, season: $season, format_in: [TV, ONA], status: $status, seasonYear: $seasonYear, startDate_like: $year, search: $search, genre_in: $genres, sort: $sort, isAdult: $isAdult) {
      id idMal
      title { romaji native english }
      startDate { year month day }
      endDate { year month day }
      status season seasonYear format genres duration popularity episodes type
      averageScore description(asHtml: true) isAdult bannerImage
      nextAiringEpisode { airingAt timeUntilAiring episode }
      coverImage { extraLarge color }
      rankings { rank type season allTime }
      studios(isMain: true) { nodes { id name siteUrl } }
    }
  }
}`;

const GENRE_QUERY = `query { GenreCollection }`;

function buildMyAnimeQuery(perPage: number) {
  return `
fragment media on Media {
  id
  title { userPreferred romaji english native }
  coverImage { extraLarge }
  episodes
  streamingEpisodes { title }
  nextAiringEpisode { id airingAt episode }
  season seasonYear status
}
query ($ids: [Int]) {
  Page(page: 1, perPage: ${perPage}) {
    media(id_in: $ids, type: ANIME) { ...media }
  }
}`;
}

// ---- anime detail ----

export async function fetchAniListAnime(id: number): Promise<MediaResponse> {
  const cacheKey = `anime:${id}`;
  const cached = await cacheGet<MediaResponse>(cacheKey);
  if (cached) return cached;

  const data = await anilistFetch<MediaResponse>(ANIME_BY_ID_QUERY, { id });

  const status = data?.data?.Media?.status;
  const ttl =
    status === "FINISHED"
      ? TTL.finished
      : status === "NOT_YET_RELEASED"
      ? 24 * 60 * 60
      : TTL.anime; // 3hr for RELEASING/default

  await cacheSet(cacheKey, data, ttl);
  return data;
}

// ---- schedule ----

export async function fetchSchedule(
  startOfWeek: number,
  endOfWeek: number,
  page: number
): Promise<CalendarQueryResponse> {
  const cacheKey = `schedule:${startOfWeek}:${endOfWeek}:${page}`;
  const cached = await cacheGet<CalendarQueryResponse>(cacheKey);
  if (cached) return cached;

  const data = await anilistFetch<CalendarQueryResponse>(SCHEDULE_QUERY, {
    weekStart: startOfWeek,
    weekEnd: endOfWeek,
    page,
  });

  // Deduplicate by media id
  const deduped = Array.from(
    new Map(
      data.data.Page.airingSchedules.map((s) => [s.media.id, s])
    ).values()
  );
  data.data.Page.airingSchedules = deduped;

  await cacheSet(cacheKey, data, TTL.schedule);
  return data;
}

// ---- search ----

export async function animeSearch(
  variables: SearchQueryVariables,
  excludeIds?: number[]
) {
  const keyPayload = JSON.stringify(variables);
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    encoder.encode(keyPayload)
  );
  const hashHex = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 16);
  const cacheKey = `search:${hashHex}`;

  let data = await cacheGet<SearchQueryResponse>(cacheKey);
  if (!data) {
    const vars: Record<string, unknown> = { ...variables };
    if (vars.year) vars.year = `${vars.year}%`;
    data = await anilistFetch<SearchQueryResponse>(SEARCH_QUERY, vars);
    await cacheSet(cacheKey, data, TTL.search);
  }

  const deduped = Array.from(
    new Map(data.data.Page.media.map((a) => [a.id, a])).values()
  );

  if (excludeIds) {
    const excluded = new Set(excludeIds);
    data.data.Page.media = deduped.filter((a) => !excluded.has(a.id));
  } else {
    data.data.Page.media = deduped;
  }

  return data;
}

export async function fetchSearch(variables: SearchQueryVariables) {
  return animeSearch(variables);
}

// ---- genres ----

export async function fetchGenres(): Promise<string[]> {
  const cacheKey = "genres";
  const cached = await cacheGet<{ data: { GenreCollection: string[] } }>(
    cacheKey
  );
  if (cached) return cached.data.GenreCollection.filter((g) => g !== "Hentai");

  const data = await anilistFetch<{ data: { GenreCollection: string[] } }>(
    GENRE_QUERY
  );
  await cacheSet(cacheKey, data, TTL.genres);
  return data.data.GenreCollection.filter((g) => g !== "Hentai");
}

// ---- today's schedule ----

export async function fetchTodaySchedule(): Promise<AiringSchedule[]> {
  const { startOfDay, endOfDay } = getTodayRange();

  try {
    const response = await fetchSchedule(startOfDay, endOfDay, 1);
    const schedules = response.data.Page.airingSchedules;

    return schedules
      .filter(
        (s) =>
          s.media.popularity > 10000 &&
          (s.media.format === "TV" || s.media.format === "ONA") &&
          !s.media.isAdult
      )
      .sort((a, b) => a.airingAt - b.airingAt);
  } catch (error) {
    console.error("Failed to fetch today's schedule:", error);
    return [];
  }
}

// ---- watchlist airing ----

export async function fetchWatchlistAiring(
  userAnimeIds: number[]
): Promise<{ schedules: AiringSchedule[]; totalCount: number }> {
  if (!userAnimeIds.length) return { schedules: [], totalCount: 0 };

  const { startOfWeek, endOfWeek } = getWeekRangeFromToday();
  const userSet = new Set(userAnimeIds);

  try {
    const all: AiringSchedule[] = [];
    let page = 1;
    let hasNext = true;

    while (hasNext && page <= 10) {
      const response = await fetchSchedule(startOfWeek, endOfWeek, page);
      all.push(...response.data.Page.airingSchedules);
      hasNext = response.data.Page.pageInfo.hasNextPage;
      page++;
    }

    const filtered = all
      .filter((s) => userSet.has(s.media.id))
      .sort((a, b) => a.airingAt - b.airingAt);

    return { schedules: filtered, totalCount: filtered.length };
  } catch (error) {
    console.error("Failed to fetch watchlist airing:", error);
    return { schedules: [], totalCount: 0 };
  }
}

// ---- batch AniList fetch (hydrates my-list entries) ----

async function fetchMyAnimeList(ids: number[]): Promise<Map<number, Anime>> {
  if (!ids.length) return new Map();
  const perPage = Math.min(ids.length, 50);
  const data = await anilistFetch<{ data: { Page: { media: Anime[] } } }>(
    buildMyAnimeQuery(perPage),
    { ids }
  );
  const map = new Map<number, Anime>();
  for (const anime of data.data.Page.media) {
    map.set(anime.id, anime);
  }
  return map;
}

// ---- my anime ids (for home page personalization) ----

export async function fetchMyAnimeIds(): Promise<number[]> {
  const { userId } = await auth();
  if (!userId) return [];

  const cacheKey = `mylist:${userId}:ids`;
  const cached = await cacheGet<number[]>(cacheKey);
  if (cached) return cached;

  try {
    const rows = await db
      .select({ animeId: myAnimes.animeId })
      .from(myAnimes)
      .where(eq(myAnimes.userId, userId));
    const ids = rows.map((r) => r.animeId);
    await cacheSet(cacheKey, ids, TTL.anime);
    return ids;
  } catch {
    return [];
  }
}

// ---- my list ----

export async function fetchMyList(
  status?: AnimeStatus
): Promise<MyListEntry[]> {
  const { userId } = await auth();
  if (!userId) return [];

  const cacheKey = status ? `mylist:${userId}:${status}` : `mylist:${userId}`;
  const cached = await cacheGet<MyListEntry[]>(cacheKey);
  if (cached) return cached;

  try {
    const rows = await db
      .select()
      .from(myAnimes)
      .where(
        status
          ? and(eq(myAnimes.userId, userId), eq(myAnimes.status, status))
          : eq(myAnimes.userId, userId)
      )
      .orderBy(desc(myAnimes.createdAt));

    const ids = rows.map((r) => r.animeId);
    const animeMap = await fetchMyAnimeList(ids);

    const entries: MyListEntry[] = rows.map((r) => ({
      id: r.id,
      animeId: r.animeId,
      status: r.status as AnimeStatus,
      episode: r.episode,
      createdAt: r.createdAt.toISOString(),
      anime: animeMap.get(r.animeId),
    }));

    await cacheSet(cacheKey, entries, TTL.anime);
    return entries;
  } catch (error) {
    console.error("Failed to fetch my list:", error);
    return [];
  }
}

// ---- stats ----

export async function fetchMyListStats(): Promise<MyListStats | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const cacheKey = `mylist:${userId}:stats`;
  const cached = await cacheGet<MyListStats>(cacheKey);
  if (cached) return cached;

  try {
    const result = await db
      .select({
        status: myAnimes.status,
        count: sql<number>`count(*)::int`,
      })
      .from(myAnimes)
      .where(eq(myAnimes.userId, userId))
      .groupBy(myAnimes.status);

    const stats: MyListStats = { watching: 0, completed: 0, dropped: 0, total: 0 };
    for (const row of result) {
      if (row.status === "WATCHING") stats.watching = row.count;
      else if (row.status === "COMPLETED") stats.completed = row.count;
      else if (row.status === "DROPPED") stats.dropped = row.count;
      stats.total += row.count;
    }

    await cacheSet(cacheKey, stats, TTL.anime);
    return stats;
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    return null;
  }
}

// ---- check if saved ----

export async function hasUserSavedAnime(animeId: number): Promise<boolean> {
  const entry = await getMyListEntry(animeId);
  return entry !== null;
}

// ---- get single entry (for anime detail page) ----

export async function getMyListEntry(
  animeId: number
): Promise<MyListEntry | null> {
  const { userId } = await auth();
  if (!userId) return null;

  try {
    const rows = await db
      .select()
      .from(myAnimes)
      .where(and(eq(myAnimes.userId, userId), eq(myAnimes.animeId, animeId)));

    if (!rows.length) return null;
    const r = rows[0];
    return {
      id: r.id,
      animeId: r.animeId,
      status: r.status as AnimeStatus,
      episode: r.episode,
      createdAt: r.createdAt.toISOString(),
    };
  } catch {
    return null;
  }
}

// ---- add to list ----

export async function addToMyList(
  animeId: number,
  status: "watching" | "completed" | "dropped",
  totalEpisodes: number | null,
  refresh: boolean,
  episodeOrFormData?: number | FormData
) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Not authenticated" };

  const apiStatus: AnimeStatus =
    status === "completed"
      ? "COMPLETED"
      : status === "dropped"
      ? "DROPPED"
      : "WATCHING";

  let episode: number | null = null;
  if (status === "completed" && totalEpisodes) {
    episode = totalEpisodes;
  } else if (typeof episodeOrFormData === "number") {
    episode = episodeOrFormData;
  } else if (episodeOrFormData instanceof FormData) {
    const val = episodeOrFormData.get("episodeNumber");
    episode = val ? parseInt(val as string) : 1;
  } else {
    episode = 1;
  }

  try {
    await db
      .insert(myAnimes)
      .values({ userId, animeId, status: apiStatus, episode })
      .onConflictDoUpdate({
        target: [myAnimes.userId, myAnimes.animeId],
        set: { status: apiStatus, episode },
      });

    await cacheDel(
      `mylist:${userId}`,
      `mylist:${userId}:ids`,
      `mylist:${userId}:stats`,
      `mylist:${userId}:WATCHING`,
      `mylist:${userId}:COMPLETED`,
      `mylist:${userId}:DROPPED`
    );

    if (refresh) {
      revalidatePath(`/anime/${animeId}`);
      revalidatePath("/my-anime");
      revalidatePath("/my-anime/watching");
      revalidatePath("/my-anime/finished");
      revalidatePath("/my-anime/dropped");
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to add anime to list:", error);
    return { success: false, error: "Failed to add" };
  }
}

// ---- remove from list ----

export async function removefromMyList(animeId: number, refresh: boolean) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Not authenticated" };

  try {
    await db
      .delete(myAnimes)
      .where(and(eq(myAnimes.userId, userId), eq(myAnimes.animeId, animeId)));

    await cacheDel(
      `mylist:${userId}`,
      `mylist:${userId}:ids`,
      `mylist:${userId}:stats`,
      `mylist:${userId}:WATCHING`,
      `mylist:${userId}:COMPLETED`,
      `mylist:${userId}:DROPPED`
    );

    if (refresh) {
      revalidatePath(`/anime/${animeId}`);
      revalidatePath("/my-anime");
      revalidatePath("/my-anime/watching");
      revalidatePath("/my-anime/finished");
      revalidatePath("/my-anime/dropped");
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to remove anime from list:", error);
    return { success: false, error: "Failed to remove" };
  }
}

export async function removeFromMyListWithRevalidation(animeId: number) {
  return removefromMyList(animeId, true);
}

// ---- update progress ----

export async function updateAnimeProgress(
  animeId: number,
  episode: number | null,
  status: AnimeStatus
) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Not authenticated" };

  try {
    await db
      .update(myAnimes)
      .set({ episode, status })
      .where(and(eq(myAnimes.userId, userId), eq(myAnimes.animeId, animeId)));

    await cacheDel(
      `mylist:${userId}`,
      `mylist:${userId}:stats`,
      `mylist:${userId}:WATCHING`,
      `mylist:${userId}:COMPLETED`,
      `mylist:${userId}:DROPPED`
    );

    revalidatePath("/my-anime");
    revalidatePath("/my-anime/watching");
    revalidatePath("/my-anime/finished");
    revalidatePath("/my-anime/dropped");
    return { success: true };
  } catch (error) {
    console.error("Failed to update anime progress:", error);
    return { success: false, error: "Failed to update" };
  }
}
