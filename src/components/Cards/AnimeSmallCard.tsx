import { Anime } from "@tutkli/jikan-ts";
import Image from "next/image";
import { LanguageContext, LanguageType } from "@/app/Provider";
import { useContext } from "react";
import { convertToLocalTime } from "@/utils/date";

interface AnimeSmallCardProps {
  anime: Anime;
}

const AnimeSmallCard = ({ anime }: AnimeSmallCardProps) => {
  const languageContext = useContext(LanguageContext);
  const image =
    anime.images.webp?.large_image_url ?? anime.images.jpg.image_url;
  const title =
    (languageContext.language === LanguageType.English
      ? anime.title_english
      : languageContext.language === LanguageType.Romanji
      ? anime.title
      : anime.title_japanese) ?? anime.title;

  const airing = anime.airing;
  var time = null;
  if (airing) {
    time = convertToLocalTime(
      anime.broadcast.day,
      anime.broadcast.time,
      anime.broadcast.timezone
    );
  }
  const season = anime.season;
  return (
    <div className="flex w-[45%] sm:w-60">
      <div className="relative h-[4.2rem] w-14">
        <Image src={image} alt={title} fill={true} />
      </div>
      <div className="flex flex-col justify-start bg-[#1f232d] w-full sm:w-40 px-2 pt-2">
        <h1 className="text-white text-sm line-clamp-2">{title}</h1>
        <p className="text-[#8c8c8c] text-xs">
          {time && time[0] !== "No time specified" ? time[0] : ""}
        </p>
        <p className="text-[#8c8c8c] text-xs">{season}</p>
      </div>
    </div>
  );
};

export default AnimeSmallCard;
