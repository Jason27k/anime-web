import {
  animeSearch,
  fetchMyAnimeIds,
  fetchTodaySchedule,
  fetchWatchlistAiring,
} from "@/app/actions";
import { cache } from "react";

const getTrending = cache(
  (seasonYear: number, season: "WINTER" | "SPRING" | "SUMMER" | "FALL") =>
    animeSearch({ seasonYear, season, sort: ["TRENDING_DESC"], page: 1 })
);
import AnimeRow from "@/components/AnimeRow";
import AnimeCardOverlay from "@/components/Cards/AnimeCardOverlay";
import HeroCarousel from "@/components/HeroCarousel";
import { AiringSchedule, MediaDisplay } from "@/utils/anilistTypes";
import Link from "next/link";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const seasonLabels: Record<string, string> = {
  WINTER: "Winter",
  SPRING: "Spring",
  SUMMER: "Summer",
  FALL: "Fall",
};

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

// ── Skeletons ──────────────────────────────────────────────

function HeroSkeleton() {
  return <Skeleton className="w-full h-85 sm:h-105 md:h-125 lg:h-140 rounded-xl" />;
}

function AnimeRowSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-1 w-12 rounded-full" />
        </div>
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="grid grid-cols-1 min-[360px]:grid-cols-2 min-[600px]:grid-cols-3 min-[900px]:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-5 xl:gap-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="aspect-3/4 rounded-lg" />
        ))}
        <Skeleton className="aspect-3/4 rounded-lg block md:hidden xl:block" />
      </div>
    </div>
  );
}

function FeaturedSectionSkeleton({ mirrored = false }: { mirrored?: boolean }) {
  const text = (
    <div className="lg:col-span-4 flex flex-col justify-center gap-3">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-9 w-48" />
      <Skeleton className="h-4 w-full max-w-xs" />
      <Skeleton className="h-4 w-3/4 max-w-xs" />
      <Skeleton className="h-10 w-44 rounded-full mt-2" />
    </div>
  );
  const cards = (
    <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
      {Array.from({ length: 2 }).map((_, i) => (
        <Skeleton key={i} className="aspect-3/4 rounded-lg" />
      ))}
      <Skeleton className="aspect-3/4 rounded-lg hidden md:block" />
    </div>
  );
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      {mirrored ? <>{cards}{text}</> : <>{text}{cards}</>}
    </section>
  );
}

// ── Async sections ─────────────────────────────────────────

async function HeroSection({
  currentSeason,
  currentSeasonYear,
}: {
  currentSeason: "WINTER" | "SPRING" | "SUMMER" | "FALL";
  currentSeasonYear: number;
}) {
  const response = await getTrending(currentSeasonYear, currentSeason);
  const trending: MediaDisplay[] = response?.data.Page.media ?? [];
  if (!trending.length) return null;
  return <HeroCarousel trendingAnime={trending} />;
}

async function TrendingFeaturedSection({
  currentSeason,
  currentSeasonYear,
}: {
  currentSeason: "WINTER" | "SPRING" | "SUMMER" | "FALL";
  currentSeasonYear: number;
}) {
  const response = await getTrending(currentSeasonYear, currentSeason);
  const trending: MediaDisplay[] = response?.data.Page.media ?? [];
  if (!trending.length) return null;

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      <div className="lg:col-span-4 flex flex-col justify-center">
        <span className="text-primary font-bold text-sm tracking-[0.2em] uppercase mb-2">
          {seasonLabels[currentSeason]} {currentSeasonYear}
        </span>
        <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-3 leading-tight text-foreground">
          Trending <br />This Season
        </h2>
        <p className="text-muted-foreground mb-5 max-w-sm leading-relaxed">
          The most talked-about anime airing right now.
        </p>
        <Link
          href={`/search?year=${currentSeasonYear}&season=${currentSeason}&sort=TRENDING_DESC`}
          className="w-fit bg-surface-container-high hover:bg-surface-container-highest text-foreground px-6 py-2.5 rounded-full border border-outline-variant/20 transition-all font-bold text-sm uppercase tracking-widest"
        >
          View All
        </Link>
      </div>
      <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {trending.slice(0, 3).map((item, index) => (
          <AnimeCardOverlay
            key={item.id}
            anime={item}
            className={index === 2 ? "hidden md:block" : undefined}
          />
        ))}
      </div>
    </section>
  );
}

async function WatchlistSection({ currentTimestamp }: { currentTimestamp: number }) {
  const [todaySchedule, ids] = await Promise.all([
    fetchTodaySchedule(),
    fetchMyAnimeIds(),
  ]);
  const userAnimeIds = ids ?? [];

  const orderedToday = [
    ...todaySchedule.filter((s: AiringSchedule) => s.airingAt > currentTimestamp),
    ...todaySchedule.filter((s: AiringSchedule) => s.airingAt <= currentTimestamp),
  ]
    .slice(0, 6)
    .map((s: AiringSchedule) => s.media);

  if (userAnimeIds.length > 0) {
    const watchlistAiringData = await fetchWatchlistAiring(userAnimeIds);
    const watchlistMedia = watchlistAiringData.schedules.map((s) => s.media);
    if (watchlistMedia.length > 0) {
      return <AnimeRow title="Your Shows This Week" animes={watchlistMedia} link="/calendar" />;
    }
    return null;
  }

  if (orderedToday.length > 0) {
    return <AnimeRow title="Today's Episodes" animes={orderedToday} link="/calendar" />;
  }

  return null;
}

async function TopRow() {
  const response = await animeSearch({ sort: ["SCORE_DESC"], page: 1 });
  const top: MediaDisplay[] = response?.data.Page.media ?? [];
  if (!top.length) return null;
  return <AnimeRow title="Top All Time" animes={top} link="/search?sort=SCORE_DESC" />;
}

async function PopularRow() {
  const response = await animeSearch({ sort: ["POPULARITY_DESC"], page: 1 });
  const popular: MediaDisplay[] = response?.data.Page.media ?? [];
  if (!popular.length) return null;
  return <AnimeRow title="Most Popular" animes={popular} link="/search?sort=POPULARITY_DESC" />;
}

async function UpcomingSection({
  nextSeason,
  nextSeasonYear,
}: {
  nextSeason: "WINTER" | "SPRING" | "SUMMER" | "FALL";
  nextSeasonYear: number;
}) {
  const response = await animeSearch({ seasonYear: nextSeasonYear, season: nextSeason, page: 1 });
  const upcoming: MediaDisplay[] = response?.data.Page.media ?? [];
  if (!upcoming.length) return null;

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {upcoming.slice(0, 3).map((item, index) => (
          <AnimeCardOverlay
            key={item.id}
            anime={item}
            className={index === 2 ? "hidden md:block" : undefined}
          />
        ))}
      </div>
      <div className="lg:col-span-4 flex flex-col justify-center">
        <span className="text-primary font-bold text-sm tracking-[0.2em] uppercase mb-2">
          {seasonLabels[nextSeason]} {nextSeasonYear}
        </span>
        <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-3 leading-tight text-foreground">
          Coming <br />Soon
        </h2>
        <p className="text-muted-foreground mb-5 max-w-sm leading-relaxed">
          A preview of the most anticipated anime arriving next season.
        </p>
        <Link
          href={`/search?year=${nextSeasonYear}&season=${nextSeason}`}
          className="w-fit bg-surface-container-high hover:bg-surface-container-highest text-foreground px-6 py-2.5 rounded-full border border-outline-variant/20 transition-all font-bold text-sm uppercase tracking-widest"
        >
          Explore Upcoming
        </Link>
      </div>
    </section>
  );
}

// ── Page ───────────────────────────────────────────────────

const page = () => {
  const { year, currentSeason, nextSeason, nextSeasonYear } = getSeasonInfo();
  const currentTimestamp = Math.floor(Date.now() / 1000);

  return (
    <div className="flex flex-col gap-16">
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSection currentSeason={currentSeason} currentSeasonYear={year} />
      </Suspense>

      <Suspense fallback={<AnimeRowSkeleton />}>
        <WatchlistSection currentTimestamp={currentTimestamp} />
      </Suspense>

      <Suspense fallback={<FeaturedSectionSkeleton />}>
        <TrendingFeaturedSection currentSeason={currentSeason} currentSeasonYear={year} />
      </Suspense>

      <Suspense fallback={<AnimeRowSkeleton />}>
        <TopRow />
      </Suspense>

      <Suspense fallback={<AnimeRowSkeleton />}>
        <PopularRow />
      </Suspense>

      <Suspense fallback={<FeaturedSectionSkeleton mirrored />}>
        <UpcomingSection nextSeason={nextSeason} nextSeasonYear={nextSeasonYear} />
      </Suspense>
    </div>
  );
};

export default page;
