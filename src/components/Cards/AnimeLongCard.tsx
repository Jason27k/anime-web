import React from "react";
import { Anime } from "@tutkli/jikan-ts";
import { LanguageContext, LanguageType } from "@/app/Provider";
import { useContext } from "react";
import { convertToLocalTime } from "@/utils/date";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AnimeLongCardProps {
  anime: Anime;
}

const AnimeLongCard = ({ anime }: AnimeLongCardProps) => {
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
  let time = null;
  let day = null;
  let season = null;
  if (airing) {
    time = convertToLocalTime(
      anime.broadcast.day,
      anime.broadcast.time,
      anime.broadcast.timezone
    );
    day =
      time[1] === 0
        ? "Mondays"
        : time[1] === 1
        ? "Tuesdays"
        : time[1] === 2
        ? "Wednesdays"
        : time[1] === 3
        ? "Thursdays"
        : time[1] === 4
        ? "Fridays"
        : time[1] === 5
        ? "Saturdays"
        : "Sundays";
  } else {
    season =
      (anime.season
        ? anime.season.charAt(0).toUpperCase() + anime.season.slice(1) + " "
        : "") + anime.year;
  }
  const episodes = anime.episodes;
  const score = anime.score;
  const members = anime.members;
  const genres = anime.genres;
  const format = anime.type;
  return (
    <div className="flex w-full sm:w-96 bg-[#1f232d] rounded-lg p-2">
      <div className="relative h-[8rem] w-24">
        <Image src={image} alt={title} width={48} height={60} />
      </div>
      <div className="flex flex-col justify-start w-full px-2 pt-2">
        <h1 className="text-white text-sm line-clamp-2">{title}</h1>
        <p className="text-[#8c8c8c] text-xs">
          {time && time[0] !== "No time specified" ? time[0] : ""}
        </p>
        <p className="text-[#8c8c8c] text-xs">
          {season && season !== "null"
            ? season + " | "
            : anime.year
            ? anime.year + " | "
            : ""}
          {format}
        </p>
        <p className="text-[#8c8c8c] text-xs">
          {episodes ? `${episodes} episodes` : ""}
        </p>
        <div className="flex items-center justify-start overflow-scroll w-full">
          {genres.slice(0, 3).map((genre, index) => (
            <Button
              key={index}
              className="rounded-xl bg-[#d67900] hover:bg-[#d67900] h-6 mx-1"
              asChild
            >
              <Link href={`/search?genres=${genre.mal_id}`}>{genre.name}</Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimeLongCard;
