import {
  animeSearch,
  fetchMyAnimeIds,
  fetchTodaySchedule,
  fetchWatchlistAiring,
  fetchHomepageData,
} from "@/app/actions";
import AnimeHomeRows from "@/components/AnimeHomeRows";
import HeroCarousel from "@/components/HeroCarousel";
import TodaysEpisodes from "@/components/TodaysEpisodes";
import WatchlistAiring from "@/components/WatchlistAiring";
import SeasonHighlights from "@/components/SeasonHighlights";
import { currentUser } from "@clerk/nextjs/server";
import { MediaDisplay, AiringSchedule } from "@/utils/anilistTypes";
import { MediaSummary, ScheduleEntry } from "@/lib/api-client";

// Helper to convert MediaSummary to MediaDisplay format
function convertMediaSummary(media: MediaSummary): MediaDisplay {
  return {
    id: media.id,
    idMal: media.idMal,
    title: media.title,
    coverImage: media.coverImage,
    bannerImage: media.bannerImage || "",
    format: media.format as MediaDisplay["format"],
    status: media.status as MediaDisplay["status"],
    season: media.season as MediaDisplay["season"],
    seasonYear: media.seasonYear,
    episodes: media.episodes || 0,
    averageScore: media.averageScore,
    popularity: media.popularity,
    genres: media.genres,
    nextAiringEpisode: media.nextAiringEpisode,
    // Default values
    startDate: { year: 0, month: 0, day: 0 },
    endDate: { year: 0, month: 0, day: 0 },
    duration: 0,
    type: "ANIME",
    description: "",
    isAdult: false,
    rankings: [],
    studios: { nodes: [] },
  };
}

// Helper to convert ScheduleEntry to AiringSchedule format
function convertScheduleEntry(entry: ScheduleEntry): AiringSchedule {
  return {
    id: entry.id,
    episode: entry.episode,
    airingAt: entry.airingAt,
    media: {
      id: entry.media.id,
      idMal: entry.media.idMal,
      title: entry.media.title,
      coverImage: entry.media.coverImage,
      bannerImage: entry.media.bannerImage || "",
      format: entry.media.format as AiringSchedule["media"]["format"],
      popularity: entry.media.popularity,
      isAdult: entry.media.isAdult,
      startDate: { year: 0, month: 0, day: 0 },
      endDate: { year: 0, month: 0, day: 0 },
      status: "RELEASING",
      season: "WINTER",
      seasonYear: new Date().getFullYear(),
      genres: [],
      duration: 0,
      type: "ANIME",
      episodes: 0,
      description: "",
      rankings: [],
      studios: { nodes: [] },
    },
  };
}

// Calculate current and next season based on month
function getSeasonInfo() {
  const year = new Date().getFullYear();
  let nextSeasonYear = year;
  const month = new Date().getMonth();
  let nextSeason: "WINTER" | "SPRING" | "SUMMER" | "FALL" = "WINTER";
  let currentSeason: "WINTER" | "SPRING" | "SUMMER" | "FALL" = "FALL";

  if (month >= 0 && month < 3) {
    nextSeason = "SPRING";
    currentSeason = "WINTER";
  } else if (month >= 3 && month < 6) {
    nextSeason = "SUMMER";
    currentSeason = "SPRING";
  } else if (month >= 6 && month < 9) {
    nextSeason = "FALL";
    currentSeason = "SUMMER";
  } else {
    nextSeasonYear += 1;
  }

  return { year, nextSeasonYear, currentSeason, nextSeason };
}

const page = async () => {
  const user = await currentUser();
  const loggedIn = !!(user && user.id);

  // Try optimized homepage endpoint first
  const [homepageData, ids] = await Promise.all([
    fetchHomepageData(),
    fetchMyAnimeIds(),
  ]);

  const userAnimeIds = ids || [];

  let trending: MediaDisplay[];
  let popular: MediaDisplay[];
  let top: MediaDisplay[];
  let upcoming: MediaDisplay[];
  let todaySchedule: AiringSchedule[];
  let currentSeason: "WINTER" | "SPRING" | "SUMMER" | "FALL";
  let nextSeason: "WINTER" | "SPRING" | "SUMMER" | "FALL";
  let year: number;
  let nextSeasonYear: number;

  if (homepageData) {
    // Use cached homepage data
    trending = homepageData.trending.map(convertMediaSummary);
    popular = homepageData.popular.map(convertMediaSummary);
    top = homepageData.top.map(convertMediaSummary);
    upcoming = homepageData.upcoming.map(convertMediaSummary);
    todaySchedule = homepageData.todaySchedule.map(convertScheduleEntry);
    currentSeason = homepageData.currentSeason;
    nextSeason = homepageData.nextSeason;
    year = homepageData.currentSeasonYear;
    nextSeasonYear = homepageData.nextSeasonYear;
  } else {
    // Fallback: fetch from AniList directly
    const seasonInfo = getSeasonInfo();
    year = seasonInfo.year;
    nextSeasonYear = seasonInfo.nextSeasonYear;
    currentSeason = seasonInfo.currentSeason;
    nextSeason = seasonInfo.nextSeason;

    const [
      todayScheduleData,
      upcomingResponse,
      trendingResponse,
      popularResponse,
      topResponse,
    ] = await Promise.all([
      fetchTodaySchedule(),
      animeSearch({
        seasonYear: nextSeasonYear,
        season: nextSeason,
        page: 1,
      }),
      animeSearch({
        seasonYear: year,
        season: currentSeason,
        sort: ["TRENDING_DESC"],
        page: 1,
      }),
      animeSearch({
        sort: ["POPULARITY_DESC"],
        page: 1,
      }),
      animeSearch({
        sort: ["SCORE_DESC"],
        page: 1,
      }),
    ]);

    todaySchedule = todayScheduleData;
    upcoming = upcomingResponse?.data.Page.media || [];
    trending = trendingResponse?.data.Page.media || [];
    popular = popularResponse?.data.Page.media || [];
    top = topResponse?.data.Page.media || [];
  }

  // Always fetch romance separately (not in cached data)
  const romanceResponse = await animeSearch({
    genres: ["Romance"],
    page: 1,
  });
  const romance = romanceResponse?.data.Page.media || [];

  // Fetch watchlist airing (user-specific, can't be cached globally)
  const watchlistAiringData =
    loggedIn && userAnimeIds.length > 0
      ? await fetchWatchlistAiring(userAnimeIds)
      : { schedules: [], totalCount: 0 };

  if (!upcoming.length || !trending.length || !popular.length || !top.length) {
    return <div>Loading...</div>;
  }

  // Determine which personalized section to show
  const showWatchlistAiring = loggedIn && userAnimeIds.length > 0;

  // Get current timestamp for Today's Episodes component
  const currentTimestamp = Math.floor(Date.now() / 1000);

  return (
    <div className="flex flex-col gap-8">
      {/* Hero Carousel */}
      <HeroCarousel trendingAnime={trending} />

      {/* Today's Episodes */}
      {todaySchedule.length > 0 && (
        <TodaysEpisodes schedules={todaySchedule} currentTimestamp={currentTimestamp} />
      )}

      {/* Personalized Section */}
      {showWatchlistAiring ? (
        watchlistAiringData.schedules.length > 0 && (
          <WatchlistAiring
            schedules={watchlistAiringData.schedules}
            totalCount={watchlistAiringData.totalCount}
          />
        )
      ) : (
        <SeasonHighlights
          anime={trending}
          currentSeason={currentSeason}
          currentSeasonYear={year}
          loggedIn={loggedIn}
          ids={userAnimeIds}
        />
      )}

      {/* Existing Discovery Rows */}
      <AnimeHomeRows
        upcoming={upcoming}
        top={top}
        trending={trending}
        popular={popular}
        romance={romance}
        nextSeason={nextSeason}
        nextSeasonYear={nextSeasonYear}
        currentSeason={currentSeason}
        currentSeasonYear={year}
        loggedIn={loggedIn}
        ids={userAnimeIds}
      />
    </div>
  );
};

export default page;
