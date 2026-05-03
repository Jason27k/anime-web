import {
  animeSearch,
  fetchMyAnimeIds,
  fetchTodaySchedule,
  fetchWatchlistAiring,
} from "@/app/actions";
import AnimeHomeRows from "@/components/AnimeHomeRows";
import AnimeRow from "@/components/AnimeRow";
import HeroCarousel from "@/components/HeroCarousel";
import { currentUser } from "@clerk/nextjs/server";
import { MediaDisplay, MediaSeason } from "@/utils/anilistTypes";

function getSeasonInfo() {
  const month = new Date().getMonth();
  const year = new Date().getFullYear();

  let currentSeason: MediaSeason;
  let nextSeason: MediaSeason;
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
  ] = await Promise.all([
    fetchTodaySchedule(),
    fetchMyAnimeIds(),
    animeSearch({ seasonYear: nextSeasonYear, season: nextSeason, page: 1 }),
    animeSearch({ seasonYear: year, season: currentSeason, sort: ["TRENDING_DESC"], page: 1 }),
    animeSearch({ sort: ["POPULARITY_DESC"], page: 1 }),
    animeSearch({ sort: ["SCORE_DESC"], page: 1 }),
  ]);

  const upcoming: MediaDisplay[] = upcomingResponse?.data.Page.media ?? [];
  const trending: MediaDisplay[] = trendingResponse?.data.Page.media ?? [];
  const popular: MediaDisplay[] = popularResponse?.data.Page.media ?? [];
  const top: MediaDisplay[] = topResponse?.data.Page.media ?? [];
  const userAnimeIds = ids ?? [];

  if (!upcoming.length && !trending.length) {
    return <div>Failed to load. Please refresh.</div>;
  }

  const watchlistAiringData =
    loggedIn && userAnimeIds.length > 0
      ? await fetchWatchlistAiring(userAnimeIds)
      : { schedules: [], totalCount: 0 };

  const currentTimestamp = Math.floor(Date.now() / 1000);

  // Sort today's schedule: upcoming first, then aired
  const orderedToday = [
    ...todaySchedule.filter((s) => s.airingAt > currentTimestamp),
    ...todaySchedule.filter((s) => s.airingAt <= currentTimestamp),
  ].slice(0, 6).map((s) => s.media);

  // Extract media from watchlist airing schedules
  const watchlistMedia = watchlistAiringData.schedules.map((s) => s.media);

  return (
    <div className="flex flex-col gap-16">
      <HeroCarousel trendingAnime={trending} />

      {userAnimeIds.length > 0 ? (
        watchlistMedia.length > 0 && (
          <AnimeRow
            title="Your Shows This Week"
            animes={watchlistMedia}
            link="/calendar"
          />
        )
      ) : (
        orderedToday.length > 0 && (
          <AnimeRow
            title="Today's Episodes"
            animes={orderedToday}
            link="/calendar"
          />
        )
      )}

      <AnimeHomeRows
        upcoming={upcoming}
        top={top}
        trending={trending}
        popular={popular}
        nextSeason={nextSeason}
        nextSeasonYear={nextSeasonYear}
        currentSeason={currentSeason}
        currentSeasonYear={year}
      />
    </div>
  );
};

export default page;
