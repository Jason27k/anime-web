"use client";
import { User, Star } from "lucide-react";
import { LanguageContext, LanguageType } from "@/app/Provider";
import { useContext } from "react";
import { cn } from "@/lib/utils";
import "@/styles/CardStyles.css";
import Link from "next/link";
import { MediaDisplay } from "@/utils/anilistTypes";
import { convertUTCToLocal } from "@/utils/date";

interface AnimeMediumResizableProps {
  anime: MediaDisplay;
  className?: string;
  airing?: number;
  loggedIn: boolean;
  ids: number[];
}

const AnimeMediumResizable = ({
  anime,
  className,
  airing,
  loggedIn,
  ids,
}: AnimeMediumResizableProps) => {
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
      className={cn(className, "flex flex-col items-start")}
    >
      <div className="flex flex-col gap-2 justify-start w-full">
        <div className="relative w-full">
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="bg-[#191d26]"
          />
        </div>
        <h2 className="text-white line-clamp-2 text-start text-base w-full h-12">
          {title}
        </h2>
        <div className="flex flex-wrap min-[450px]:flex-nowrap text-[#8c8c8c] gap-2 text-sm items-end justify-between -mt-1">
          <div
            className={`justify-start items-center gap-1 ${
              airingString ? "hidden" : "flex"
            } min-[450px]:flex`}
          >
            <User size={17} />
            <p>
              {" "}
              {members > 1000000
                ? Math.floor(members / 100000) / 10 + "M"
                : Math.floor(members / 1000) + "K"}
            </p>
          </div>
          <p className="text-start">{airingString}</p>
          <div
            className={`justify-start items-center gap-1 ${
              airingString ? "hidden" : "flex"
            } min-[450px]:flex`}
          >
            {score && <Star size={17} />}
            <p>{score}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AnimeMediumResizable;
