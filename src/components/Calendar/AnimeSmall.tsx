import { Anime } from "@tutkli/jikan-ts";
import AnimeSmallCard from "../Cards/AnimeSmallCard";
import AnimeLongCard from "../Cards/AnimeLongCard";

const AnimeSmall = ({
  animeData,
  showDay,
}: {
  animeData: Anime[];
  showDay: boolean;
}) => {
  return (
    <>
      {showDay ? (
        animeData.map((anime: Anime) => (
          <AnimeLongCard anime={anime} key={anime.mal_id} />
        ))
      ) : (
        <div className="flex justify-start flex-wrap w-full ml-auto">
          {animeData.map((anime: Anime) => (
            <div className="py-2" key={anime.mal_id}>
              <AnimeSmallCard anime={anime} />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default AnimeSmall;
