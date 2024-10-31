"use client";
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, PlayCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Anime } from "@/utils/myAnimeTypes";
import Image from "next/image";
import { convertUTCToLocal } from "@/utils/date";
import { capitalize } from "@/utils/formatting";
import Link from "next/link";

interface MyAnimeProps {
  animes: Anime[];
}

export default function MyAnimePage({ animes }: MyAnimeProps) {
  const [filter, setFilter] = useState<"all" | "watching" | "finished">("all");
  function timeOrSeasonString(anime: Anime) {
    let airingString = "";
    if (anime.nextAiringEpisode && anime.nextAiringEpisode.airingAt) {
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
      return airingString + " at " + time;
    }
    const season = anime.season;
    const year = anime.seasonYear;
    return `${capitalize(season)} ${year}`;
  }

  return (
    <div className="container mx-auto p-4 text-white ">
      <h1 className="text-2xl font-bold mb-4">My Anime List</h1>
      <div className="flex justify-center gap-2 pt-4 md:pt-0 py-3">
        <Button
          className={`${
            filter === "all"
              ? "bg-[#d67900] text-white "
              : "bg-[#1f1f1f] text-[#d67900]"
          }`}
          onClick={() => setFilter("all")}
        >
          All
        </Button>
        <Button
          className={`${
            filter === "watching"
              ? "bg-[#d67900] text-white "
              : "bg-[#1f1f1f] text-[#d67900]"
          }`}
          onClick={() => setFilter("watching")}
        >
          <PlayCircle className="mr-2 h-4 w-4" />
          Watching
        </Button>
        <Button
          className={`${
            filter === "finished"
              ? "bg-[#d67900] text-white"
              : "bg-[#1f1f1f] text-[#d67900]"
          }`}
          onClick={() => setFilter("finished")}
        >
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Finished
        </Button>
      </div>
      <ScrollArea className="h-[calc(100vh-150px)]">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {animes
            .filter((anime) =>
              filter === "all"
                ? true
                : filter === "watching"
                ? anime.id % 2 == 0
                : anime.id % 2 != 0
            )
            .map((anime: Anime) => (
              <Card
                key={anime.id}
                className="overflow-hidden border-0 bg-[#1f232d] flex flex-col justify-between"
              >
                <div className="relative w-full h-48">
                  <Image
                    src={anime.coverImage.extraLarge}
                    alt={anime.title.userPreferred}
                    fill
                    className="object-cover"
                  />
                </div>

                <CardContent className="p-4">
                  <h2
                    className="font-bold text-lg mb-2 line-clamp-1 text-white"
                    title={anime.title.userPreferred}
                  >
                    {anime.title.userPreferred}
                  </h2>
                  <Badge
                    variant="default"
                    className={`mb-2 ${
                      anime.id % 2 == 0 ? "bg-blue-600" : "bg-green-600"
                    }`}
                  >
                    {anime.id % 2 == 0 ? "Watching" : "Finished"}
                  </Badge>
                  <p className="text-sm text-muted-foreground mb-1">
                    Episodes: {anime.episodes - (1 - (anime.episodes % 2))} /{" "}
                    {anime.episodes}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {timeOrSeasonString(anime)}
                  </p>
                </CardContent>
                <CardFooter className="p-4 bg-[#191d26]">
                  <Button
                    variant="outline"
                    className="w-full bg-[#d67900] border-0 text-white"
                    asChild
                  >
                    <Link href={"/anime/" + anime.id}>
                      {anime.id % 2 == 0 ? "Continue" : "Rewatch"}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </div>
      </ScrollArea>
    </div>
  );
}
