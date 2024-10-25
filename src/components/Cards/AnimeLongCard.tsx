import React, { useState, useEffect, useRef } from "react";
import { Anime } from "@tutkli/jikan-ts";
import { LanguageContext, LanguageType } from "@/app/Provider";
import { useContext } from "react";
import { convertToLocalTime } from "@/utils/date";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Star, User } from "lucide-react";

interface AnimeLongCardProps {
  anime: Anime;
}

const AnimeLongCard = ({ anime }: AnimeLongCardProps) => {
  const languageContext = useContext(LanguageContext);
  const [visibleGenres, setVisibleGenres] = useState(1);
  const [maxWidth, setMaxWidth] = useState(window.innerWidth - 40); // Initialize with window width - 40px (20px padding each side)
  const genreContainerRef = useRef<HTMLDivElement>(null);

  const genres = anime.genres;
  const CHAR_SIZE = 14.6;
  const PLUS_BUTTON_WIDTH = 50;

  const updateVisibleGenres = () => {
    if (genreContainerRef.current) {
      let containerWidth =
        genreContainerRef.current.getBoundingClientRect().width - 60;
      if (genres.length === 0) {
        setVisibleGenres(0);
        return;
      }

      let currentSize = CHAR_SIZE * genres[0].name.length;
      let index = 1;
      while (currentSize < containerWidth && index < genres.length - 1) {
        currentSize += anime.genres[index].name.length * CHAR_SIZE;
        index++;
      }
      const containerMinusButtonWidth = containerWidth - PLUS_BUTTON_WIDTH;
      if (currentSize > containerWidth) {
        setVisibleGenres(index - 1);
      } else if (currentSize < containerMinusButtonWidth) {
        setVisibleGenres(index);
      } else {
        if (currentSize >= containerMinusButtonWidth) {
          setVisibleGenres(index - 1);
        } else {
          setVisibleGenres(index - 1);
        }
      }
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setMaxWidth(window.innerWidth - 40); // Update max width on window resize
      updateVisibleGenres();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [genreContainerRef.current, genres]);

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
  let season = null;
  if (airing) {
    time = convertToLocalTime(
      anime.broadcast.day,
      anime.broadcast.time,
      anime.broadcast.timezone
    );
  } else {
    season =
      (anime.season
        ? anime.season.charAt(0).toUpperCase() + anime.season.slice(1) + " "
        : "") + anime.year;
  }
  const episodes = anime.episodes;
  const score = anime.score;
  const members = anime.members;

  return (
    <Link
      href={"/anime/" + anime.mal_id}
      className="flex w-full md:w-[22rem] xl:w-96 bg-[#1f232d] rounded-lg p-2 h-32"
      style={{ maxWidth: maxWidth + "px" }}
    >
      <div className="relative h-28 w-[75px] max-w-[75px] min-w-[75px]">
        <Image src={image} alt={title} fill />
      </div>
      <div className="flex flex-col justify-evenly items-start w-full px-2 max-w-48 min-[380px]:max-w-none">
        <div className="flex justify-start pl-1">
          <h1 className="text-white text-sm line-clamp-2 text-start max-w-48">
            {title}
          </h1>
        </div>
        <div className="flex justify-start text-start gap-1 w-full">
          {time && time[0] !== "No time specified" ? (
            <p className="text-[#8c8c8c] text-xs text-start pl-1">{time[0]}</p>
          ) : (
            <p className="text-[#8c8c8c] text-xs">
              {season && season !== "null"
                ? season + " | "
                : anime.year
                ? anime.year + " | "
                : ""}
            </p>
          )}
          <p className="text-[#8c8c8c] text-xs text-start">
            {episodes ? `${episodes} episodes` : ""}
          </p>
        </div>
        <div className="flex gap-2 justify-start items-end pl-1">
          <div className="flex items-center gap-1">
            <Star size={17} className="text-[#d67900]" />
            <p className="text-[#8c8c8c] text-xs text-center">{score}</p>
          </div>
          <div className="flex items-center gap-1">
            <User size={17} className="text-[#d67900]" />
            <p className="text-[#8c8c8c] text-xs text-center">
              {members > 1000000
                ? Math.floor(members / 100000) / 10 + "M"
                : Math.floor(members / 1000) + "K"}
            </p>
          </div>
        </div>
        <div
          ref={genreContainerRef}
          className="flex items-center justify-start overflow-hidden w-full"
        >
          {genres.slice(0, visibleGenres).map((genre, index) => (
            <Button
              key={index}
              className="rounded-xl bg-[#d67900] hover:bg-[#d67900] h-6 mx-1"
              asChild
            >
              <Link href={`/search?genres=${genre.mal_id}`}>{genre.name}</Link>
            </Button>
          ))}
          {genres.length > visibleGenres && (
            <Button
              className="rounded-xl bg-[#d67900] hover:bg-[#d67900] h-6 mx-1"
              asChild
            >
              <p>+{genres.length - visibleGenres}</p>
            </Button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default AnimeLongCard;
