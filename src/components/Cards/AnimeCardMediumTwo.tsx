"use client";
import Image from "next/image";
import { Anime } from "@tutkli/jikan-ts";
import { User, Star } from "lucide-react";
import { LanguageContext, LanguageType } from "@/app/Provider";
import { useContext } from "react";
import { convertToLocalTime } from "@/utils/date";
import { cn } from "@/lib/utils";

interface AnimeMediumResizableProps {
  anime: Anime;
  className?: string;
}

const AnimeMediumResizable = ({
  anime,
  className,
}: AnimeMediumResizableProps) => {
  const languageContext = useContext(LanguageContext);

  const image =
    anime.images.webp?.large_image_url ??
    anime.images.jpg.large_image_url ??
    anime.images.jpg.image_url;
  const title =
    (languageContext.language === LanguageType.English
      ? anime.title_english
      : languageContext.language === LanguageType.Romanji
      ? anime.title
      : anime.title_japanese) ?? anime.title;

  const airing = anime.airing;
  let time = null;
  if (airing) {
    time = convertToLocalTime(
      anime.broadcast.day,
      anime.broadcast.time,
      anime.broadcast.timezone
    );
  }
  const score = anime.score;
  const members = anime.members;
  return (
    <div className={cn(className, "flex flex-col items-start")}>
      <div className="flex flex-col gap-2 justify-start w-full">
        <div className="relative flex items-start min-w-[100px] min-h-[140px] max-w-[220px] max-h-[315px] mx-auto">
          <Image
            src={image}
            alt={anime.title}
            width={185}
            height={265}
            placeholder="blur"
            blurDataURL="./placeholder.svg"
            loading="lazy"
            className="mx-auto w-full"
          />
        </div>
        <h2 className="text-white line-clamp-2 text-start text-base w-full h-12">
          {title}
        </h2>
        <div className="flex text-[#8c8c8c] gap-2 text-sm items-end justify-between -mt-1">
          <div className="flex justify-start items-center gap-1">
            <User size={17} />
            <p>
              {" "}
              {members > 1000000
                ? Math.floor(members / 100000) / 10 + "M"
                : Math.floor(members / 1000) + "K"}
            </p>
          </div>
          {<p className="text-start">{time ? time[0] : ""}</p>}
          <div className="flex justify-start items-center gap-1">
            {score && <Star size={17} />}
            <p>{score}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeMediumResizable;
