"use server";
import {
  CalendarQueryResponse,
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
    description
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
        description
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
  const json: CalendarQueryResponse = await response.json();
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
      description
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

type SearchQueryVariables = {
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

export async function animeSearch(variables: SearchQueryVariables) {
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
  const json: SearchQueryResponse = await response.json();
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
