import AnimeRow from "./AnimeRow";
import { MediaDisplay } from "@/utils/anilistTypes";

interface AnimeHomeRowsProps {
  upcoming: MediaDisplay[];
  trending: MediaDisplay[];
  popular: MediaDisplay[];
  top: MediaDisplay[];
  romance: MediaDisplay[];
  nextSeason: string;
  nextSeasonYear: number;
  currentSeason?: "WINTER" | "SPRING" | "SUMMER" | "FALL";
  currentSeasonYear?: number;
  loggedIn: boolean;
  ids: number[];
}

const seasonLabels: Record<string, string> = {
  WINTER: "Winter",
  SPRING: "Spring",
  SUMMER: "Summer",
  FALL: "Fall",
};

const AnimeHomeRows = ({
  upcoming,
  trending,
  popular,
  top,
  romance,
  nextSeason,
  nextSeasonYear,
  currentSeason,
  currentSeasonYear,
  loggedIn,
  ids,
}: AnimeHomeRowsProps) => {
  const currentSeasonLabel = currentSeason ? seasonLabels[currentSeason] : null;
  const trendingTitle =
    currentSeasonLabel && currentSeasonYear
      ? `Trending ${currentSeasonLabel} ${currentSeasonYear}`
      : "Trending";

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex flex-col gap-8 pt-2 h-full">
        {/* Current season trending first for seasonal focus */}
        <AnimeRow
          title={trendingTitle}
          animes={trending}
          link={
            currentSeason && currentSeasonYear
              ? `/search?season=${currentSeason}&year=${currentSeasonYear}&sort=TRENDING_DESC`
              : "/search?sort=TRENDING_DESC"
          }
          loggedIn={loggedIn}
          ids={ids}
        />
        <AnimeRow
          title="Top All Time"
          animes={top}
          link="/search?sort=SCORE_DESC"
          loggedIn={loggedIn}
          ids={ids}
        />
        <AnimeRow
          title="Upcoming Season"
          animes={upcoming}
          link={`/search?year=${nextSeasonYear}&season=${nextSeason}`}
          loggedIn={loggedIn}
          ids={ids}
        />
        <AnimeRow
          title="Popular Anime"
          animes={popular}
          link="/search?sort=POPULARITY_DESC"
          loggedIn={loggedIn}
          ids={ids}
        />
        <AnimeRow
          title="Romance Lover"
          animes={romance}
          link="/search?genres=Romance"
          loggedIn={loggedIn}
          ids={ids}
        />
      </div>
    </div>
  );
};

export default AnimeHomeRows;
