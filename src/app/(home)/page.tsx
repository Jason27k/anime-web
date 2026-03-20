import {
  animeSearch,
  fetchMyAnimeIds,
  fetchTodaySchedule,
  fetchWatchlistAiring,
} from "@/app/actions";
import AnimeHomeRows from "@/components/AnimeHomeRows";
import HeroCarousel from "@/components/HeroCarousel";
import TodaysEpisodes from "@/components/TodaysEpisodes";
import WatchlistAiring from "@/components/WatchlistAiring";
import { currentUser } from "@clerk/nextjs/server";
import { MediaDisplay, AiringSchedule } from "@/utils/anilistTypes";

function getSeasonInfo() {
  const month = new Date().getMonth();
  const year = new Date().getFullYear();

  let currentSeason: "WINTER" | "SPRING" | "SUMMER" | "FALL";
  let nextSeason: "WINTER" | "SPRING" | "SUMMER" | "FALL";
  let nextSeasonYear = year;

  if (month < 3) {
    currentSeason = "WINTER";
    nextSeason = "SPRING";
  } else if (month < 6) {
    currentSeason = "SPRING";
    nextSeason = "SUMMER";
  } else if (month < 9) {
    currentSeason = "SUMMER";
    nextSeason = "FALL";
  } else {
    currentSeason = "FALL";
    nextSeason = "WINTER";
    nextSeasonYear = year + 1;
  }

  return { year, currentSeason, nextSeason, nextSeasonYear };
}

const page = async () => {
  const user = await currentUser();
  const loggedIn = !!(user?.id);

  const { year, currentSeason, nextSeason, nextSeasonYear } = getSeasonInfo();

  const [
    todaySchedule,
    ids,
    upcomingResponse,
    trendingResponse,
    popularResponse,
    topResponse,
    romanceResponse,
  ] = await Promise.all([
    fetchTodaySchedule(),
    fetchMyAnimeIds(),
    animeSearch({ seasonYear: nextSeasonYear, season: nextSeason, page: 1 }),
    animeSearch({ seasonYear: year, season: currentSeason, sort: ["TRENDING_DESC"], page: 1 }),
    animeSearch({ sort: ["POPULARITY_DESC"], page: 1 }),
    animeSearch({ sort: ["SCORE_DESC"], page: 1 }),
    animeSearch({ genres: ["Romance"], page: 1 }),
  ]);

  const upcoming: MediaDisplay[] = upcomingResponse?.data.Page.media ?? [];
  const trending: MediaDisplay[] = trendingResponse?.data.Page.media ?? [];
  const popular: MediaDisplay[] = popularResponse?.data.Page.media ?? [];
  const top: MediaDisplay[] = topResponse?.data.Page.media ?? [];
  const romance: MediaDisplay[] = romanceResponse?.data.Page.media ?? [];
  const userAnimeIds = ids ?? [];

  if (!upcoming.length && !trending.length) {
    return <div>Failed to load. Please refresh.</div>;
  }

  const watchlistAiringData =
    loggedIn && userAnimeIds.length > 0
      ? await fetchWatchlistAiring(userAnimeIds)
      : { schedules: [], totalCount: 0 };

  const currentTimestamp = Math.floor(Date.now() / 1000);

  return (
    <div className="flex flex-col gap-8">
      <HeroCarousel trendingAnime={trending} />

      {userAnimeIds.length > 0 ? (
        watchlistAiringData.schedules.length > 0 && (
          <WatchlistAiring
            schedules={watchlistAiringData.schedules}
            totalCount={watchlistAiringData.totalCount}
          />
        )
      ) : (
        todaySchedule.length > 0 && (
          <TodaysEpisodes
            schedules={todaySchedule}
            currentTimestamp={currentTimestamp}
          />
        )
      )}

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
