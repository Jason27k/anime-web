"use client";

import { CirclePlus, Star, User } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { LanguageContext, LanguageType } from "@/app/Provider";
import { useContext } from "react";
import { useEffect, useState, useRef } from "react";
import { MediaDisplay } from "@/utils/anilistTypes";
import { convertUTCToLocal } from "@/utils/date";
import { useRouter } from "next/navigation";
import { capitalize } from "@/utils/formatting";

export function convertHtmlToPlainText(htmlString: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  return doc.body.textContent || "";
}

interface AnimeCardProps {
  anime: MediaDisplay;
  airing?: number;
}

const AnimeCard = ({ anime, airing }: AnimeCardProps) => {
  const router = useRouter();
  const languageContext = useContext(LanguageContext);
  const [visibleGenres, setVisibleGenres] = useState(3);
  const genreContainerRef = useRef<HTMLDivElement>(null);

  const updateVisibleGenres = () => {
    if (genreContainerRef.current) {
      const containerWidth = genreContainerRef.current.offsetWidth;
      const buttonWidth = 100; // Approximate width of each genre button
      const additionalButtonWidth = 50; // Approximate width of the "+X" button

      // Calculate how many genres can fit based on the container width
      let maxGenres = Math.floor(containerWidth / buttonWidth) - 1;
      if (visibleGenres < maxGenres) {
        maxGenres -= additionalButtonWidth;
      }
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

  const image = anime.coverImage.extraLarge;
  const producer = anime.studios.nodes[0]?.name ?? "";
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
  const score =
    anime.averageScore === null || !anime.averageScore
      ? ""
      : anime.averageScore / 10;
  const members = anime.popularity;
  const synopsis = convertHtmlToPlainText(anime.description);
  const genres = anime.genres;

  return (
    <Link
      href={"/anime/" + anime.id}
      className="flex h-[265px] justify-center w-full"
    >
      <div className="flex flex-col relative h-full w-[185px]">
        <div className="relative h-[265px] w-full min-w-[135px]">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
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
          {airingString ? (
            <p className="text-lg">{airingString}</p>
          ) : (
            <p className="text-lg">
              {season && capitalize(season)} {year}
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
          <div
            ref={genreContainerRef}
            className="flex items-center justify-start overflow-hidden w-full"
          >
            {genres.slice(0, visibleGenres).map((genre, index) => (
              <Button
                key={index}
                className="rounded-xl bg-[#d67900] hover:bg-[#d67900] h-6 mx-1"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push("/search/?genres=" + genre);
                }}
                asChild
              >
                <p>{genre}</p>
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
    </Link>
  );
};

export default AnimeCard;
