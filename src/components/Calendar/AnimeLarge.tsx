import { Anime } from "@tutkli/jikan-ts";
import AnimeCard from "./AnimeCard";
import { LanguageContext, LanguageType } from "@/app/Provider";
import { useContext } from "react";

const AnimeLarge = ({
  animeData,
  dates,
}: {
  animeData: Anime[];
  dates: Map<Number, [String, Number]>;
}) => {
  const languageContext = useContext(LanguageContext);

  return (
    <>
      {animeData.map((anime: Anime) => (
        <AnimeCard
          key={anime.mal_id}
          image={
            anime.images.webp?.large_image_url ?? anime.images.jpg.image_url
          }
          producer={anime.producers[0]?.name ?? ""}
          title={
            (languageContext.language === LanguageType.English
              ? anime.title_english
              : languageContext.language === LanguageType.Romanji
              ? anime.title
              : anime.title_japanese) ?? anime.title
          }
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
