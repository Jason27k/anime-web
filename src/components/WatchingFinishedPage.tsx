import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, PlayCircle } from "lucide-react";
import { Anime } from "@/utils/myAnimeTypes";
import { convertUTCToLocal } from "@/utils/date";
import { capitalize } from "@/utils/formatting";
import Link from "next/link";
import { AnimeInfo } from "@/app/my-anime/page";

interface MyAnimeProps {
  animeInfoList: AnimeInfo[];
  route: "all" | "watching" | "finished";
}

export default function MyAnimePage({ animeInfoList, route }: MyAnimeProps) {
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
    <div className="">
      <div className="flex justify-center gap-2 pt-4 md:pt-0 py-3">
        <Button
          className={`${
            route === "all"
              ? "bg-[#d67900] text-white "
              : "bg-[#1f1f1f] text-[#d67900]"
          }`}
          asChild
        >
          <Link href="/my-anime">All</Link>
        </Button>
        <Button
          className={`${
            route === "watching"
              ? "bg-[#d67900] text-white "
              : "bg-[#1f1f1f] text-[#d67900]"
          }`}
          asChild
        >
          <Link href="/my-anime/watching">
            <PlayCircle className="mr-2 h-4 w-4" />
            <p>Watching</p>
          </Link>
        </Button>
        <Button
          className={`${
            route === "finished"
              ? "bg-[#d67900] text-white"
              : "bg-[#1f1f1f] text-[#d67900]"
          }`}
          asChild
        >
          <Link href="/my-anime/finished">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            <p>Finished</p>
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {animeInfoList
          .filter((animeInfo) =>
            route === "all"
              ? true
              : route === "watching"
              ? !animeInfo.finished
              : animeInfo.finished
          )
          .map((animeInfo: AnimeInfo) => (
            <Card
              key={animeInfo.anime.id}
              className="overflow-hidden border-0 bg-[#1f232d] flex flex-col justify-between"
            >
              <div className="relative w-full h-48">
                <img
                  src={animeInfo.anime.coverImage.extraLarge}
                  alt={animeInfo.anime.title.userPreferred}
                  className="object-cover h-full w-full"
                />
              </div>

              <CardContent className="p-4">
                <h2
                  className="font-bold text-lg mb-2 line-clamp-1 text-white"
                  title={animeInfo.anime.title.userPreferred}
                >
                  {animeInfo.anime.title.userPreferred}
                </h2>
                <Badge
                  variant="default"
                  className={`mb-2 ${
                    !animeInfo.finished ? "bg-blue-600" : "bg-green-600"
                  }`}
                >
                  {!animeInfo.finished ? "Watching" : "Finished"}
                </Badge>
                {animeInfo.anime.episodes && (
                  <p className="text-sm text-muted-foreground mb-1">
                    Episodes: {animeInfo.episode ? animeInfo.episode : 1}/{" "}
                    {animeInfo.anime.episodes}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {timeOrSeasonString(animeInfo.anime)}
                </p>
              </CardContent>
              <CardFooter className="p-4 bg-[#191d26]">
                <Button
                  variant="outline"
                  className="w-full bg-[#d67900] border-0 text-white"
                  asChild
                >
                  <Link href={"/anime/" + animeInfo.anime.id}>
                    {!animeInfo.finished ? "Continue" : "Rewatch"}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
      </div>
    </div>
  );
}
