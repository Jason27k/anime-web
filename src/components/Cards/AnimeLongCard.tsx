"use client";
import React, { useState, useEffect, useRef } from "react";
import { LanguageContext, LanguageType } from "@/app/Provider";
import { useContext } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Star, User } from "lucide-react";
import { MediaDisplay } from "@/utils/anilistTypes";
import { convertUTCToLocal } from "@/utils/date";
import { useRouter } from "next/navigation";
import { capitalize } from "@/utils/formatting";

interface AnimeLongCardProps {
  anime: MediaDisplay;
  airing?: number;
  loggedIn: boolean;
  ids: number[];
}

const AnimeLongCard = ({
  anime,
  airing,
  loggedIn,
  ids,
}: AnimeLongCardProps) => {
  const router = useRouter();
  const languageContext = useContext(LanguageContext);
  const [genres, setGenres] = useState<string[]>([]);
  const genreContainerRef = useRef<HTMLDivElement>(null);

  const genresList = anime.genres;
  const CHAR_SIZE = 14.6;
  const PLUS_BUTTON_WIDTH = 50;

  const updateVisibleGenres = () => {
    if (genreContainerRef.current) {
      let containerWidth =
        genreContainerRef.current.getBoundingClientRect().width - 50;
      if (genresList.length === 0) {
        return;
      }

      let currentSize = CHAR_SIZE * genresList[0].length;
      let index = 1;
      while (currentSize < containerWidth && index < genresList.length - 1) {
        if (
          currentSize + anime.genres[index].length * CHAR_SIZE >
          containerWidth
        ) {
          while (currentSize > containerWidth - PLUS_BUTTON_WIDTH) {
            currentSize -= anime.genres[index].length * CHAR_SIZE;
            index -= 1;
          }
          break;
        }
        currentSize += anime.genres[index].length * CHAR_SIZE;
        index++;
      }

      setGenres(genresList.slice(0, index));
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
    const day = date.getDay();
    if (day === 0) {
      airingString = "Sundays";
    } else if (day === 1) {
      airingString = "Mondays";
    } else if (day === 2) {
      airingString = "Tuesdays";
    } else if (day === 3) {
      airingString = "Wednesdays";
    } else if (day === 4) {
      airingString = "Thursdays";
    } else if (day === 5) {
      airingString = "Fridays";
    } else if (day === 6) {
      airingString = "Saturdays";
    } else {
      airingString = "No time specified";
    }
    const time = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
    });
    airingString = airingString + " at " + time;
  } else if (anime.nextAiringEpisode) {
    const date = convertUTCToLocal(anime.nextAiringEpisode.airingAt);
    const day = date.getDay();
    if (day === 0) {
      airingString = "Sundays";
    } else if (day === 1) {
      airingString = "Mondays";
    } else if (day === 2) {
      airingString = "Tuesdays";
    } else if (day === 3) {
      airingString = "Wednesdays";
    } else if (day === 4) {
      airingString = "Thursdays";
    } else if (day === 5) {
      airingString = "Fridays";
    } else if (day === 6) {
      airingString = "Saturdays";
    } else {
      airingString = "No time specified";
    }
    const time = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
    });
    airingString = airingString + " at " + time;
  }

  const season = anime.season;
  const year = anime.seasonYear;

  const episodes = anime.episodes;
  const score =
    anime.averageScore === null || !anime.averageScore
      ? ""
      : anime.averageScore / 10;

  return (
    <Link
      href={"/anime/" + anime.id}
      className="flex w-full bg-[#1f232d] rounded-lg p-2 h-32 min-w-[330px] overflow-x-clip"
    >
      <div className="relative h-28 w-[75px] max-w-[75px] min-w-[75px]">
        <img src={image} alt={title} className="bg-[#191d26]" />
      </div>
      <div className="flex flex-col justify-evenly items-start w-full px-4">
        <div className="flex justify-start pl-1">
          <h1 className="text-white text-sm line-clamp-2 text-start">
            {title}
          </h1>
        </div>
        <div className="flex justify-start text-start gap-1 w-full">
          {airingString ? (
            <p className="text-[#8c8c8c] text-xs text-start pl-1">
              {airingString}
            </p>
          ) : (
            <p className="text-[#8c8c8c] text-xs">
              {season && capitalize(season)} {year}
            </p>
          )}
          <p className="text-[#8c8c8c] text-xs text-start">
            {episodes ? `| ${episodes} episodes` : ""}
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
              {anime.popularity > 1000000
                ? Math.floor(anime.popularity / 100000) / 10 + "M"
                : Math.floor(anime.popularity / 1000) + "K"}
            </p>
          </div>
        </div>
        <div
          className="flex items-center justify-start overflow-hidden w-full"
          ref={genreContainerRef}
        >
          {genres.map((genre) => (
            <Button
              key={genre}
              className="rounded-xl bg-[#d67900] hover:bg-[#d67900] h-6 mx-1"
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the outer link
                router.push(`/search?genres=${genre}`);
              }}
            >
              {genre}
            </Button>
          ))}
          {genresList.length > genres.length && (
            <Button className="rounded-xl bg-[#d67900] hover:bg-[#d67900] h-6 mx-1">
              <p>+{genresList.length - genres.length}</p>
            </Button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default AnimeLongCard;
