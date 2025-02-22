"use client";

import { CirclePlus, MinusCircleIcon, Star, User } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { LanguageContext, LanguageType } from "@/app/Provider";
import { useContext } from "react";
import { useEffect, useState, useRef } from "react";
import { MediaDisplay } from "@/utils/anilistTypes";
import { convertUTCToLocal } from "@/utils/date";
import { capitalize } from "@/utils/formatting";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { addToMyList } from "@/app/actions";
import { removefromMyList } from "@/app/actions";

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
  const [showDialog, setShowDialog] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [newLiked, setNewLiked] = useState(false);

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

  const testWithIDWatching = addToMyList.bind(
    null,
    anime.id,
    "watching",
    false
  );
  const testWithIDFinished = addToMyList.bind(
    null,
    anime.id,
    "finished",
    false
  );
  const removeWithId = removefromMyList.bind(null, anime.id, false);

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
          <p className="text-[#d67900] text-start line-clamp-1 text-xs pt-2">
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
                  className="rounded-xl bg-[#d67900] hover:bg-[#d67900] h-6 mx-1"
                  asChild
                >
                  <Link href={"/search/?genres=" + genre}>{genre}</Link>
                </Button>
              ))}
              {genresList.length > genres.length && (
                <Button className="rounded-xl bg-[#d67900] hover:bg-[#d67900] h-6 mx-1">
                  <p>+{genresList.length - genres.length}</p>
                </Button>
              )}
            </div>

            {loggedIn && !ids.includes(anime.id) && !newLiked ? (
              <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogTrigger asChild>
                  <CirclePlus
                    size={24}
                    className="text-[#7c8793]"
                    onClick={() => {
                      setShowDialog(true);
                    }}
                  />
                </DialogTrigger>
                <DialogContent className="bg-[#1f232d] border-0 text-white">
                  <DialogHeader>
                    <DialogTitle className="line-clamp-2">{title}</DialogTitle>
                    <DialogDescription>
                      Do you want to add this anime to your list?
                    </DialogDescription>
                  </DialogHeader>
                  <Tabs defaultValue="watching">
                    <TabsList className="flex gap-2 w-min">
                      <TabsTrigger value="watching">Watching</TabsTrigger>
                      <TabsTrigger value="finished">Finished</TabsTrigger>
                    </TabsList>
                    <TabsContent value="watching" className="w-full mt-2">
                      <form
                        className="flex justify-between items-center w-full"
                        action={testWithIDWatching}
                      >
                        {anime.episodes && anime.episodes > 1 && (
                          <div className="flex flex-col w-[60%] gap-2">
                            <Label htmlFor="episodeNumber">Episode</Label>
                            <Input
                              name="episodeNumber"
                              type="number"
                              min={1}
                              max={anime.episodes || 12}
                              className="text-black"
                              defaultValue={1}
                            />
                          </div>
                        )}
                        <div className="flex justify-end space-x-2 mt-4">
                          <Button
                            className="bg-blue-600 hover:bg-blue-600"
                            onClick={() => {
                              setShowDialog(false);
                              setNewLiked(true);
                            }}
                            type="submit"
                          >
                            Add to Watching
                          </Button>
                        </div>
                      </form>
                    </TabsContent>
                    <TabsContent value="finished" className="w-full mt-2">
                      <form className="" action={testWithIDFinished}>
                        <Button
                          className="bg-green-600 hover:bg-green-600"
                          type="submit"
                          onClick={() => {
                            setShowDialog(false);
                            setNewLiked(true);
                          }}
                        >
                          Finished
                        </Button>
                      </form>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            ) : newLiked || loggedIn ? (
              <Dialog
                open={showRemoveDialog}
                onOpenChange={setShowRemoveDialog}
              >
                <DialogTrigger asChild>
                  <MinusCircleIcon size={24} className="text-[#7c8793]" />
                </DialogTrigger>
                <DialogContent className="bg-[#1f232d] border-0 text-white">
                  <DialogHeader>
                    <DialogTitle className="line-clamp-2">{title}</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to remove this from your list?
                    </DialogDescription>
                  </DialogHeader>
                  <form
                    className="flex justify-between items-center w-full"
                    action={removeWithId}
                  >
                    <div className="flex justify-end space-x-2 mt-4">
                      <Button
                        className="bg-red-600 hover:bg-red-600"
                        onClick={() => {
                          setShowRemoveDialog(false);
                          setNewLiked(false);
                        }}
                        type="submit"
                      >
                        Remove from List
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeCard;
