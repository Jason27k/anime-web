import { Anime } from "@tutkli/jikan-ts";
import AnimeCard from "./AnimeCard";

const AnimeLarge = ({
  animeData,
  dates,
}: {
  animeData: Anime[];
  dates: Map<Number, [String, Number]>;
}) => {
  return (
    <>
      {animeData.map((anime: Anime) => (
        <AnimeCard
          key={anime.mal_id}
          image={
            anime.images.webp?.large_image_url ?? anime.images.jpg.image_url
          }
          producer={anime.producers[0]?.name ?? ""}
          title={anime.title_english ?? anime.title}
          time={dates.get(anime.mal_id)?.[0] ?? ""}
          score={anime.score}
          members={anime.members}
          synopsis={anime.synopsis}
          genres={anime.genres.map((genre) => genre.name)}
        />
      ))}
    </>
  );
};

export default AnimeLarge;
