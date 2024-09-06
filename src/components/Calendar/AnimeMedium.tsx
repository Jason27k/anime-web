import { Anime } from "@tutkli/jikan-ts";
import AnimeCardMedium from "./AnimeCardMedium";

const AnimeMedium = ({
  animeData,
  dates,
}: {
  animeData: Anime[];
  dates: Map<Number, [String, Number]>;
}) => {
  return (
    <>
      {animeData.map((anime: Anime) => (
        <AnimeCardMedium
          anime={anime}
          time={dates.get(anime.mal_id)?.[0] ?? ""}
          key={anime.mal_id}
        />
      ))}
    </>
  );
};

export default AnimeMedium;
