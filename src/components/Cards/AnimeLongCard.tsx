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
  const [visibleGenres, setVisibleGenres] = useState(3);
  const genreContainerRef = useRef<HTMLDivElement>(null);

  const updateVisibleGenres = () => {
    if (genreContainerRef.current) {
      let containerWidth = genreContainerRef.current.offsetWidth;
      const buttonWidth = 90;
      const additionalButtonWidth = 50;
      if (visibleGenres < anime.genres.length) {
        containerWidth -= additionalButtonWidth;
      }
      const maxGenres = Math.floor(containerWidth / buttonWidth) - 1;
      setVisibleGenres(Math.max(1, maxGenres));
    }
  };

  useEffect(() => {
    const observer = new ResizeObserver(updateVisibleGenres);
    if (genreContainerRef.current) {
      observer.observe(genreContainerRef.current);
    }
    return () => {
      if (genreContainerRef.current) {
        observer.unobserve(genreContainerRef.current);
      }
    };
  }, []);

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
  const genres = anime.genres;

  return (
    <div className="flex w-full md:w-96 bg-[#1f232d] rounded-lg p-2 h-32">
      <div className="relative h-28 w-24">
        <Image src={image} alt={title} fill />
      </div>
      <div className="flex flex-col justify-evenly items-start w-full px-2">
        <div className="flex justify-start pl-1">
          <h1 className="text-white text-sm line-clamp-2 text-start">
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
    </div>
  );
};

export default AnimeLongCard;
