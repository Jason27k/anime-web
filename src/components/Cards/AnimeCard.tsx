"use client";

import { CirclePlus, Pencil, Star, User } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { LanguageContext, LanguageType } from "@/app/Provider";
import { useContext } from "react";
import { useEffect, useState, useRef } from "react";
import { MediaDisplay } from "@/utils/anilistTypes";
import { convertUTCToLocal } from "@/utils/date";
import { capitalize } from "@/utils/formatting";
import AnimeSheet from "../AnimeSheet";

interface AnimeCardProps {
  anime: MediaDisplay;
  airing?: number;
  loggedIn: boolean;
  ids: number[];
}

const CHAR_SIZE = 14.6;
const PLUS_BUTTON_WIDTH = 50;

const AnimeCard = ({ anime, airing, loggedIn, ids }: AnimeCardProps) => {
  const languageContext = useContext(LanguageContext);
  const [genres, setGenres] = useState<string[]>([]);
  const genreContainerRef = useRef<HTMLDivElement>(null);
  const [description, setDescription] = useState<string>("");
  const [addSheetOpen, setAddSheetOpen] = useState(false);
  const [isInList, setIsInList] = useState(ids.includes(anime.id));

  const genresList = anime.genres;

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

    function stripHtml(html: string) {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;
      return tempDiv.innerText || tempDiv.textContent;
    }
    setDescription(stripHtml(anime.description || "") || "");

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

  return (
    <div className="flex h-[265px] justify-center w-full">
      <Link
        href={"/anime/" + anime.id}
        className="flex flex-col relative h-full w-[185px]"
      >
        <div className="relative h-[265px] w-full min-w-[135px]">
          <img src={image} alt={title} className="bg-[#191d26] w-full h-full" />
        </div>
        <div className="bg-[#000000b3] flex flex-col justify-around items-start absolute bottom-0 w-full min-h-20 p-2">
          <p className="text-white line-clamp-3 my-autotext-sm text-start">
            {title}
          </p>
          <p className="text-primary text-start line-clamp-1 text-xs pt-2">
            {producer}
          </p>
        </div>
      </Link>
      <div className="flex flex-col justify-between bg-[#1f232d] w-[98%] max-w-[500px]">
        <Link
          href={"/anime/" + anime.id}
          className="flex justify-between text-white p-3"
        >
          {airingString ? (
            <p className="text-lg">{airingString}</p>
          ) : (
            <p className="text-lg">
              {season && capitalize(season)} {year}
            </p>
          )}
          <div className="flex flex-col items-end">
            <div className="flex gap-2">
              <Star size={16} className="text-primary" />
              <p className="text-sm">{score}</p>
            </div>
            <div className="flex gap-2">
              <User size={16} className="text-primary" />
              <p className="text-sm">
                {members > 1000000
                  ? Math.floor(members / 100000) / 10 + "M"
                  : Math.floor(members / 1000) + "K"}
              </p>
            </div>
          </div>
        </Link>
        <Link
          href={"/anime/" + anime.id}
          className="text-gray-400 pl-3 w-[98%] flex-1"
        >
          <div className="line-clamp-5 text-sm w-[98%]" ref={genreContainerRef}>
            {description}
          </div>
        </Link>
        <div className="flex items-center bg-[#191d26] justify-start h-[46px] px-1 overflow-hidden w-full">
          <div className="flex items-center justify-between overflow-hidden w-full h-full">
            <div className="w-full h-full flex items-center">
              {genres.map((genre) => (
                <Button
                  key={genre}
                  className="rounded-xl bg-primary text-primary-foreground hover:bg-primary h-6 mx-1"
                  asChild
                >
                  <Link href={"/search/?genres=" + genre}>{genre}</Link>
                </Button>
              ))}
              {genresList.length > genres.length && (
                <Button className="rounded-xl bg-primary text-primary-foreground hover:bg-primary h-6 mx-1">
                  <p>+{genresList.length - genres.length}</p>
                </Button>
              )}
            </div>

            {loggedIn && (
              <>
                {isInList ? (
                  <Pencil
                    size={20}
                    className="text-[#7c8793] cursor-pointer hover:text-primary transition-colors"
                    onClick={() => setAddSheetOpen(true)}
                  />
                ) : (
                  <CirclePlus
                    size={24}
                    className="text-[#7c8793] cursor-pointer hover:text-primary transition-colors"
                    onClick={() => setAddSheetOpen(true)}
                  />
                )}
                <AnimeSheet
                  open={addSheetOpen}
                  onOpenChange={setAddSheetOpen}
                  animeId={anime.id}
                  animeTitle={title}
                  totalEpisodes={anime.episodes}
                  coverImage={anime.coverImage.extraLarge}
                  isInList={isInList}
                  onSuccess={(action) => {
                    setIsInList(action === "added" || action === "updated");
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeCard;
