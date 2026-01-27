"use server";
import {
  animeApi,
  AnimeStatus,
  SavedAnimeResponse,
} from "@/lib/api-client";
import {
  CalendarQueryResponse,
  MediaDisplay,
  SearchQueryResponse,
} from "@/utils/anilistTypes";

const animeIdQuery = `
query media($id: Int) {
  Media(id: $id, type:ANIME) {
    id
    idMal
    title {
      romaji
      english
      native
    }
    coverImage {
      extraLarge
      large
    }
    bannerImage
    startDate {
      year
      month
      day
    }
    endDate {
      year
      month
      day
    }
    description(asHtml:true)
    season
    seasonYear
    type
    format
    status(version: 2)
    episodes
    duration
    chapters
    volumes
    genres
    synonyms
    source(version: 3)
    isAdult
    isLocked
    meanScore
    averageScore
    popularity
    favourites
    isFavouriteBlocked
    hashtag
    countryOfOrigin
    isLicensed
    isFavourite
    isRecommendationBlocked
    isFavouriteBlocked
    isReviewBlocked
    nextAiringEpisode {
      airingAt
      timeUntilAiring
      episode
    }
    relations {
      edges {
        id
        relationType(version: 2)
        node {
          id
          idMal
          title {
            english
            native
            romaji
          }
          format
          type
          status(version: 2)
          bannerImage
          coverImage {
            large
          }
        }
      }
    }
    characterPreview: characters(perPage: 6, sort: [ROLE, RELEVANCE, ID]) {
      edges {
        id
        role
        name
        voiceActors(language: JAPANESE, sort: [RELEVANCE, ID]) {
          id
          name {
            userPreferred
          }
          language: languageV2
          image {
            large
          }
        }
        node {
          id
          name {
            userPreferred
          }
          image {
            large
          }
        }
      }
    }
    staffPreview: staff(perPage: 8, sort: [RELEVANCE, ID]) {
      edges {
        id
        role
        node {
          id
          name {
            userPreferred
          }
          language: languageV2
          image {
            large
          }
        }
      }
    }
    studios {
      edges {
        isMain
        node {
          id
          name
        }
      }
    }
    reviewPreview: reviews(perPage: 2, sort: [RATING_DESC, ID]) {
      pageInfo {
        total
      }
      nodes {
        id
        summary
        rating
        ratingAmount
        user {
          id
          name
          avatar {
            large
          }
        }
      }
    }
    recommendations(perPage: 10, sort: [RATING_DESC, ID]) {
      pageInfo {
        total
      }
      nodes {
        id
        rating
        userRating
        mediaRecommendation {
          id
          title {
            romaji
            english
            native
          }
          idMal
          format
          type
          status(version: 2)
          bannerImage
          coverImage {
            large
          }
        }
        user {
          id
          name
          avatar {
            large
          }
        }
      }
    }
    externalLinks {
      id
      site
      url
      type
      language
      color
      icon
      notes
      isDisabled
    }
    streamingEpisodes {
      site
      title
      thumbnail
      url
    }
    trailer {
      id
      site
    }
    rankings {
      id
      rank
      type
      format
      year
      season
      allTime
      context
    }
    tags {
      id
      name
      description
      rank
      isMediaSpoiler
      isGeneralSpoiler
      userId
    }
    mediaListEntry {
      id
      status
      score
    }
    stats {
      statusDistribution {
        status
        amount
      }
      scoreDistribution {
        score
        amount
      }
    }
  }
}
`;

export const fetchAniListAnime = async (id: number) => {
  const query = animeIdQuery;
  return await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query,
      variables: { id },
    }),
    cache: "force-cache",
  });
};

const calendarQuery = `
query ($weekStart: Int, $weekEnd: Int, $page: Int) {
  Page(page: $page) {
    pageInfo {
      hasNextPage
      total
    }
    airingSchedules(airingAt_greater: $weekStart, airingAt_lesser: $weekEnd) {
      id
      episode
      airingAt
      media {
        id
        idMal
        title {
          romaji
          native
          english
        }
        startDate {
          year
          month
          day
        }
        endDate {
          year
          month
          day
        }
        status
        season
        seasonYear
        format
        genres
        duration
        popularity
        episodes
        type
        averageScore
        description(asHtml:true)
        isAdult
        bannerImage
        nextAiringEpisode {
          airingAt
          timeUntilAiring
          episode
        }
        coverImage {
          extraLarge
          color
        }
        rankings {
          rank
          type
          season
          allTime
        }
        studios(isMain: true) {
          nodes {
            id
            name
            siteUrl
          }
        }
      }
    }
  }
}
`;

export const fetchSchedule = async (
  startOfWeek: number,
  endOfWeek: number,
  page: number
) => {
  const query = calendarQuery;
  const response = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query,
      variables: { weekStart: startOfWeek, weekEnd: endOfWeek, page: page },
    }),
    cache: "force-cache",
  });
  let json: CalendarQueryResponse = await response.json();
  const deduplicatedAnimes = Array.from(
    new Map(
      json.data.Page.airingSchedules.map((anime) => [anime.media.id, anime])
    ).values()
  );
  json.data.Page.airingSchedules = deduplicatedAnimes;
  return json;
};

const searchQuery = `
query ($page: Int = 1, $id: Int, $isAdult: Boolean = false, $search: String, $status: MediaStatus, $season: MediaSeason, $seasonYear: Int, $year: String, $genres: [String], $sort: [MediaSort] = [POPULARITY_DESC, SCORE_DESC]) {
  Page(page: $page, perPage: 20) {
    pageInfo {
      total
      perPage
      currentPage
      lastPage
      hasNextPage
    }
    media(id: $id, type: ANIME, season: $season, format_in:[TV, ONA], status: $status, seasonYear: $seasonYear, startDate_like: $year, search: $search, genre_in: $genres, sort: $sort, isAdult: $isAdult) {
      id
      idMal
      title {
        romaji
        native
        english
      }
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
      status
      season
      seasonYear
      format
      genres
      duration
      popularity
      episodes
      type
      averageScore
      description(asHtml:true)
      isAdult
      bannerImage
      nextAiringEpisode {
        airingAt
        timeUntilAiring
        episode
      }
      coverImage {
        extraLarge
        color
      }
      rankings {
        rank
        type
        season
        allTime
      }
      studios(isMain: true) {
        nodes {
          id
          name
          siteUrl
        }
      }
    }
  }
}
`;

// $page: Int = 1, $id: Int, $isAdult: Boolean = false, $search: String, $status: MediaStatus, $season: MediaSeason, $seasonYear: Int, $year: String, $genres: [String], $sort

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

export const fetchSearch = async (variables: SearchQueryVariables) => {
  const response = await animeSearch(variables);
  return response;
};

export async function animeSearch(
  variables: SearchQueryVariables,
  uniqueIds?: Number[]
) {
  if (variables.year) {
    variables.year = variables.year + "%";
  }
  const query = searchQuery;
  const response = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    cache: "force-cache",
  });
  let json: SearchQueryResponse = await response.json();

  const deduplicatedAnimes = Array.from(
    new Map(json.data.Page.media.map((anime) => [anime.id, anime])).values()
  );

  const uniqueSet = new Set(uniqueIds);
  if (uniqueIds) {
    json.data.Page.media = deduplicatedAnimes.filter(
      (anime) => !uniqueSet.has(anime.id)
    );
  } else {
    json.data.Page.media = deduplicatedAnimes;
  }

  return json;
}

const genreQuery = `
query {
	GenreCollection
}
`;

type GenreQueryResponse = {
  data: {
    GenreCollection: string[];
  };
};

export async function fetchGenres() {
  const query = genreQuery;
  const response = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query,
    }),
    cache: "force-cache",
  });
  const json: GenreQueryResponse = await response.json();
  return json.data.GenreCollection.filter((genre) => genre !== "Hentai");
}

const MyAnimeQuery = `
fragment media on Media {
  id
  title {
    userPreferred
    romaji
    english
    native
  }
  coverImage {
    extraLarge
  }
  episodes
  streamingEpisodes {
    title
  }
  nextAiringEpisode {
    id
    airingAt
    episode
  }
  season
  seasonYear
}

query ($ids: [Int]) {
  Page(page: 1, perPage: PER_PAGE) {
    media(id_in: $ids, type:ANIME) {
      ...media
    }
  }
}
`;

export async function fetchMyAnimeList(ids: number[], PER_PAGE: number) {
  const query = MyAnimeQuery.replace("PER_PAGE", PER_PAGE.toString());
  const response = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query,
      variables: { ids, PER_PAGE },
    }),
    cache: "force-cache",
  });
  const json = await response.json();
  return json;
}

import { Anime, AnimeData } from "@/utils/myAnimeTypes";

export async function getLikedAnimesList(
  savedAnimeList: SavedAnimeResponse[],
  PER_PAGE: number
) {
  let likedAnimes = [];
  let ids = [];
  for (let i = 0; i < savedAnimeList.length; i++) {
    likedAnimes.push({
      id: savedAnimeList[i].animeId,
      status: savedAnimeList[i].status,
      episode: savedAnimeList[i].episode,
      anime: {} as Anime,
    });
    ids.push(savedAnimeList[i].animeId);
  }

  const data: AnimeData = await fetchMyAnimeList(ids, PER_PAGE);
  const animes = data.data;
  for (let i = 0; i < likedAnimes.length; i++) {
    likedAnimes[i].anime = animes.Page.media.filter(
      (anime) => anime.id === likedAnimes[i].id
    )[0];
  }
  return likedAnimes;
}

import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function addToMyList(
  animeId: number,
  status: "watching" | "completed",
  totalEpisodes: number | null,
  refresh: boolean,
  formData: FormData
) {
  const user = await currentUser();
  if (!user) {
    return;
  }

  try {
    // Check if already saved
    const alreadySaved = await animeApi.hasUserSavedAnime(user.id, animeId);
    if (alreadySaved) {
      return;
    }

    // Add to list
    await animeApi.addAnimeToList(user.id, animeId);

    // Update with status and episode
    const apiStatus: AnimeStatus = status === "completed" ? "COMPLETED" : "WATCHING";

    // For completed status, set episode to total if available
    // For watching status, use the form value
    let episode: number | null = null;
    if (status === "completed" && totalEpisodes) {
      episode = totalEpisodes;
    } else {
      const formEpisode = formData.get("episodeNumber");
      episode = formEpisode ? parseInt(formEpisode as string) : 1;
    }

    await animeApi.updateAnimeProgress(user.id, animeId, {
      status: apiStatus,
      episode,
    });

    if (refresh) {
      revalidatePath(`/anime/${animeId}`);
    }
  } catch (error) {
    console.error("Failed to add anime to list:", error);
    throw error;
  }
}

export async function removefromMyList(animeId: number, refresh: boolean) {
  const user = await currentUser();
  if (!user) {
    return;
  }

  try {
    await animeApi.removeAnimeFromList(user.id, animeId);

    if (refresh) {
      revalidatePath(`/anime/${animeId}`);
    }
  } catch (error) {
    console.error("Failed to remove anime from list:", error);
    throw error;
  }
}

export async function fetchMyAnimeIds() {
  const user = await currentUser();
  if (!user) {
    return;
  }

  try {
    const savedAnime = await animeApi.getAllUserAnime(user.id);
    return savedAnime.map((anime) => anime.animeId);
  } catch (error) {
    console.error("Failed to fetch anime IDs:", error);
    return [];
  }
}

export async function fetchSavedAnime(
  status?: AnimeStatus,
  page: number = 0,
  size: number = 20
) {
  const user = await currentUser();
  if (!user) {
    return null;
  }

  try {
    return await animeApi.getSavedAnime(user.id, {
      status,
      page,
      size,
      sortBy: "createdAt",
      sortDirection: "desc",
    });
  } catch (error) {
    console.error("Failed to fetch saved anime:", error);
    return null;
  }
}

export async function fetchSavedAnimeCount(status?: AnimeStatus) {
  const user = await currentUser();
  if (!user) {
    return 0;
  }

  try {
    return await animeApi.countUserAnime(user.id, status);
  } catch (error) {
    console.error("Failed to fetch anime count:", error);
    return 0;
  }
}

export async function hasUserSavedAnime(animeId: number) {
  const user = await currentUser();
  if (!user) {
    return false;
  }

  try {
    return await animeApi.hasUserSavedAnime(user.id, animeId);
  } catch (error) {
    console.error("Failed to check if anime is saved:", error);
    return false;
  }
}

export async function updateAnimeProgress(
  animeId: number,
  episode: number | null,
  status: AnimeStatus
) {
  const user = await currentUser();
  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    await animeApi.updateAnimeProgress(user.id, animeId, {
      episode,
      status,
    });
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

export async function removeFromMyListWithRevalidation(animeId: number) {
  const user = await currentUser();
  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    await animeApi.removeAnimeFromList(user.id, animeId);
    revalidatePath("/my-anime");
    revalidatePath("/my-anime/watching");
    revalidatePath("/my-anime/finished");
    revalidatePath("/my-anime/dropped");
    return { success: true };
  } catch (error) {
    console.error("Failed to remove anime:", error);
    return { success: false, error: "Failed to remove" };
  }
}

export async function fetchAnimeStats() {
  const user = await currentUser();
  if (!user) {
    return null;
  }

  try {
    return await animeApi.getUserAnimeStats(user.id);
  } catch (error) {
    console.error("Failed to fetch anime stats:", error);
    return null;
  }
}
