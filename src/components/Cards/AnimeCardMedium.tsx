"use client";
import { User, Star } from "lucide-react";
import { LanguageContext, LanguageType } from "@/app/Provider";
import { useContext } from "react";
import Link from "next/link";
import { MediaDisplay } from "@/utils/anilistTypes";
import { convertUTCToLocal } from "@/utils/date";

interface AnimeCardMediumProps {
  anime: MediaDisplay;
  airing?: number;
  loggedIn: boolean;
  ids: number[];
}

const AnimeCardMedium = ({
  anime,
  airing,
  loggedIn,
  ids,
}: AnimeCardMediumProps) => {
  const languageContext = useContext(LanguageContext);

  const image = anime.coverImage.extraLarge;
  const title =
    (languageContext.language === LanguageType.English
      ? anime.title.english
      : languageContext.language === LanguageType.Romanji
      ? anime.title.romaji
      : anime.title.native) ?? anime.title.romaji;

  let airingString = "";
  if (airing) {
    const date = convertUTCToLocal(airing);
    const time = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
    });
    airingString = time;
  }
  const score =
    anime.averageScore === null || !anime.averageScore
      ? ""
      : anime.averageScore / 10;
  const members = anime.popularity;
  return (
    <Link
      href={"/anime/" + anime.id}
      className="flex flex-col items-start h-96"
    >
      <div className="flex flex-col gap-2 justify-start h-96">
        <div className="relative h-72 w-52 flex items-start">
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="bg-[#191d26] mx-auto h-72 w-52"
          />
        </div>
        <h2 className="w-52 text-white line-clamp-2 text-start text-base h-[3rem]">
          {title}
        </h2>
        <div className="flex text-[#8c8c8c] gap-2 text-sm items-end justify-between ">
          <div className="flex justify-start items-center gap-1">
            <User size={17} />
            <p>
              {" "}
              {members > 1000000
                ? Math.floor(members / 100000) / 10 + "M"
                : Math.floor(members / 1000) + "K"}
            </p>
          </div>
          {<p className="text-start">{airingString}</p>}
          <div className="flex justify-start items-center gap-1">
            <Star size={17} />
            <p>{score}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AnimeCardMedium;
