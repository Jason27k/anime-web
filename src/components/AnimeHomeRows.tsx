import AnimeRow from "./AnimeRow";
import { MediaDisplay } from "@/utils/anilistTypes";
import AnimeCarousel from "./AnimeCarousel";

interface AnimeHomeRowsProps {
  upcoming: MediaDisplay[];
  trending: MediaDisplay[];
  popular: MediaDisplay[];
  top: MediaDisplay[];
  romance: MediaDisplay[];
  nextSeason: string;
  nextSeasonYear: number;
  loggedIn: boolean;
  ids: number[];
}

const AnimeHomeRows = ({
  upcoming,
  trending,
  popular,
  top,
  romance,
  nextSeason,
  nextSeasonYear,
  loggedIn,
  ids,
}: AnimeHomeRowsProps) => {
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex flex-col gap-8 pt-2 h-full">
        <AnimeRow
          title="Trending"
          animes={trending}
          link="/search?sort=TRENDING_DESC"
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
