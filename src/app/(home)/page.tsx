import {
  animeSearch,
  fetchMyAnimeIds,
  fetchTodaySchedule,
  fetchWatchlistAiring,
} from "@/app/actions";
import AnimeHomeRows from "@/components/AnimeHomeRows";
import AnimeRow from "@/components/AnimeRow";
import HeroCarousel from "@/components/HeroCarousel";
import { AiringSchedule, MediaDisplay } from "@/utils/anilistTypes";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

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

function AnimeRowSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-1 w-12" />
        </div>
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="grid grid-cols-1 min-[360px]:grid-cols-2 min-[600px]:grid-cols-3 min-[900px]:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-5 xl:gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="aspect-3/4 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

async function WatchlistSection({
  todaySchedule,
  currentTimestamp,
}: {
  todaySchedule: AiringSchedule[];
  currentTimestamp: number;
}) {
  const ids = await fetchMyAnimeIds();
  const userAnimeIds = ids ?? [];

  const orderedToday = [
    ...todaySchedule.filter((s) => s.airingAt > currentTimestamp),
    ...todaySchedule.filter((s) => s.airingAt <= currentTimestamp),
  ]
    .slice(0, 6)
    .map((s) => s.media);

  if (userAnimeIds.length > 0) {
    const watchlistAiringData = await fetchWatchlistAiring(userAnimeIds);
    const watchlistMedia = watchlistAiringData.schedules.map((s) => s.media);

    if (watchlistMedia.length > 0) {
      return (
        <AnimeRow
          title="Your Shows This Week"
          animes={watchlistMedia}
          link="/calendar"
        />
      );
    }
    return null;
  }

  if (orderedToday.length > 0) {
    return (
      <AnimeRow
        title="Today's Episodes"
        animes={orderedToday}
        link="/calendar"
      />
    );
  }

  return null;
}

const page = async () => {
  const { year, currentSeason, nextSeason, nextSeasonYear } = getSeasonInfo();

  const [
    todaySchedule,
    upcomingResponse,
    trendingResponse,
    popularResponse,
    topResponse,
  ] = await Promise.all([
    fetchTodaySchedule(),
    animeSearch({ seasonYear: nextSeasonYear, season: nextSeason, page: 1 }),
    animeSearch({ seasonYear: year, season: currentSeason, sort: ["TRENDING_DESC"], page: 1 }),
    animeSearch({ sort: ["POPULARITY_DESC"], page: 1 }),
    animeSearch({ sort: ["SCORE_DESC"], page: 1 }),
  ]);

  const upcoming: MediaDisplay[] = upcomingResponse?.data.Page.media ?? [];
  const trending: MediaDisplay[] = trendingResponse?.data.Page.media ?? [];
  const popular: MediaDisplay[] = popularResponse?.data.Page.media ?? [];
  const top: MediaDisplay[] = topResponse?.data.Page.media ?? [];

  if (!upcoming.length && !trending.length) {
    return <div>Failed to load. Please refresh.</div>;
  }

  const currentTimestamp = Math.floor(Date.now() / 1000);

  return (
    <div className="flex flex-col gap-16">
      <HeroCarousel trendingAnime={trending} />

      <Suspense fallback={<AnimeRowSkeleton />}>
        <WatchlistSection todaySchedule={todaySchedule} currentTimestamp={currentTimestamp} />
      </Suspense>

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
