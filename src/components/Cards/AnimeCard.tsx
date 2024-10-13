import { CirclePlus, Star, User } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { LanguageContext, LanguageType } from "@/app/Provider";
import { useContext } from "react";
import { convertToLocalTime } from "@/utils/date";
import { Anime } from "@tutkli/jikan-ts";

interface AnimeCardProps {
  anime: Anime;
  showDay: boolean;
}

const AnimeCard = ({ anime, showDay }: AnimeCardProps) => {
  const languageContext = useContext(LanguageContext);

  const image =
    anime.images.webp?.large_image_url ?? anime.images.jpg.image_url;
  const producer = anime.producers[0]?.name ?? "";
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
  const score = anime.score;
  const members = anime.members;
  const synopsis = anime.synopsis;
  const genres = anime.genres;

  return (
    <div className="flex h-[265px] justify-center w-full">
      <div className="flex flex-col relative h-full w-[185px]">
        <div className="relative h-[265px] w-full min-w-[135px]">
          <Image src={image} alt={title} fill />
        </div>
        <div className="bg-[#000000b3] flex flex-col justify-around items-start absolute bottom-0 w-full min-h-20 p-2">
          <p className="text-white line-clamp-3 my-autotext-sm text-start">
            {title}
          </p>
          <p className="text-[#d67900] text-start line-clamp-1 text-xs pt-2">
            {producer}
          </p>
        </div>
      </div>
      <div className="flex flex-col bg-[#1f232d] w-[98%] max-w-[500px]">
        <div className="flex justify-between text-[#9fa7b0] p-3">
          {time && time[0] !== "No time specified" ? (
            <p className="text-lg">
              {showDay ? day + " at " : ""}
              {time[0]}
            </p>
          ) : (
            <p className="text-lg">
              {season && season !== "null"
                ? season
                : anime.year
                ? anime.year
                : anime.type}
            </p>
          )}
          <div className="flex flex-col items-end">
            <div className="flex gap-2">
              <Star size={16} className="text-[#d67900]" />
              <p className="text-sm">{score}</p>
            </div>
            <div className="flex gap-2">
              <User size={16} className="text-[#d67900]" />
              <p className="text-sm">
                {members > 1000000
                  ? Math.floor(members / 100000) / 10 + "M"
                  : Math.floor(members / 1000) + "K"}
              </p>
            </div>
          </div>
        </div>
        <div className="text-[#7c8793] pl-3 w-[98%]">
          <p className="line-clamp-5 text-sm w-[98%]">{synopsis}</p>
        </div>
        <div className="flex flex-row-reverse items-center bg-[#191d26] justify-start mt-auto h-12 px-1 overflow-hidden w-full">
          <div className="ml-auto pl-1">
            <CirclePlus size={24} className="text-[#7c8793] ml-auto" />
          </div>
          <div className="flex items-center justify-start overflow-scroll w-full">
            {genres.slice(0, 3).map((genre, index) => (
              <Button
                key={index}
                className="rounded-xl bg-[#d67900] hover:bg-[#d67900] h-6 mx-1"
                asChild
              >
                <Link href={`/search?genres=${genre.mal_id}`}>
                  {genre.name}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeCard;
