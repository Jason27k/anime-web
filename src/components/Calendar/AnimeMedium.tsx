import { Anime } from "@tutkli/jikan-ts";
import AnimeCardMedium from "./AnimeCardMedium";
import { LanguageContext, LanguageType } from "@/app/Provider";
import { useContext } from "react";

const AnimeMedium = ({
  animeData,
  dates,
  scroll,
}: {
  animeData: Anime[];
  dates: Map<Number, [String, Number]>;
  scroll?: boolean;
}) => {
  const languageContext = useContext(LanguageContext);

  return (
    <>
      {animeData.map((anime: Anime) => (
        <AnimeCardMedium
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
          members={anime.members}
          score={anime.score}
          time={dates.get(anime.mal_id)?.[0] ?? ""}
          scroll={scroll}
          key={anime.mal_id}
        />
      ))}
    </>
  );
};

export default AnimeMedium;
