import AnimeRow from "./AnimeRow";
import { MediaDisplay } from "@/utils/anilistTypes";
import AnimeCarousel from "./AnimeCarousel";

interface AnimeHomeRowsProps {
  upcoming: MediaDisplay[];
  trending: MediaDisplay[];
  popular: MediaDisplay[];
  top: MediaDisplay[];
  romance: MediaDisplay[];
}

const AnimeHomeRows = ({
  upcoming,
  trending,
  popular,
  top,
  romance,
}: AnimeHomeRowsProps) => {
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex flex-col gap-8 pt-2 h-full">
        <AnimeRow
          title="Trending"
          animes={trending}
          link="/search?sort=TRENDING_DESC"
        />
        <AnimeRow
          title="Top All Time"
          animes={top}
          link="/search?sort=SCORE_DESC"
        />
        <AnimeRow title="Upcoming Season" animes={upcoming} link="/upcoming" />
        <AnimeRow
          title="Popular Anime"
          animes={popular}
          link="/search?sort=POPULARITY_DESC"
        />
        <AnimeRow
          title="Romance Lover"
          animes={romance}
          link="/search?genres=Romance"
        />
      </div>
    </div>
  );
};

export default AnimeHomeRows;
