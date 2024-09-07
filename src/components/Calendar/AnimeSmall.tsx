import { Anime } from "@tutkli/jikan-ts";
import AnimeSmallCard from "./AnimeSmallCard";
import { LanguageContext, LanguageType } from "@/app/Provider";
import { useContext } from "react";

const AnimeSmall = ({
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
        <AnimeSmallCard
          title={
            (languageContext.language === LanguageType.English
              ? anime.title_english
              : languageContext.language === LanguageType.Romanji
              ? anime.title
              : anime.title_japanese) ?? anime.title
          }
          image={
            anime.images.webp?.large_image_url ?? anime.images.jpg.image_url
          }
          time={dates.get(anime.mal_id)?.[0] ?? ""}
          key={anime.mal_id}
        />
      ))}
    </>
  );
};

export default AnimeSmall;
